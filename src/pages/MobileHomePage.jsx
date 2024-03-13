import { useEffect, useState } from "react";
import { Bodies, Composite, Engine, Render, Runner } from "matter-js";

const MobileHomePage = () => {
  const [SCREEN_WIDTH, setScreenWidth] = useState(0);
  const [SCREEN_HEIGHT, setScreenHeight] = useState(0);
  const [engine, setEngine] = useState(null);
  const [render, setRender] = useState(null);

  useEffect(() => {
    setScreenWidth(document.body.clientWidth);
    setScreenHeight(document.body.clientHeight);
  }, []);

  useEffect(() => {
    if (SCREEN_WIDTH === 0 || SCREEN_HEIGHT === 0) return;
    matterInitialize();

    return () => {
      if (render) Render.stop(render);
      if (engine) Runner.stop(engine);
    };
  }, [SCREEN_WIDTH, SCREEN_HEIGHT]);

  // MatterEngineがゲーム専用に作ってしまっておりこちらへの実用が難しかったため、matter.jsでやっています。
  const matterInitialize = () => {
    const parent = document.getElementById("Back-Object");
    const mEngine = Engine.create();
    const mRender = Render.create({
      element: parent,
      engine: mEngine,
      options: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        wireframes: false,
        background: "transparent",
      },
    });
    setEngine(mEngine);
    setRender(mRender);
    Render.run(mRender);

    Composite.add(mEngine.world, [createGround(), spawnObjects()]);
    Runner.run(Runner.create(), mEngine);
  };

  const createGround = () => {
    // 床部分。透過して見えなくしている。
    const GROUND_HEIGHT = 30;
    const ground = Bodies.rectangle(SCREEN_WIDTH / 2, SCREEN_HEIGHT - GROUND_HEIGHT, SCREEN_WIDTH, GROUND_HEIGHT, { isStatic: true, render: { fillStyle: "transparent" } });
    return ground
  }

  const spawnObjects = () => {
    const spawnComposite = Composite.create();
    // ランダムで物理オブジェクトを生成
    const SPAWN_HEIGHT = 500;
    const SPAWN_HEIGHT_RANGE = 20;
    const SPAWN_ANGLE = 360;
    const SPAWN_SIZE = 50;
    const SPAWN_TYPE = 3;
    for (let i = 0; i < 30; i++) {
      // ごちゃっと感を出すためにランダムで生成
      const objectType = Math.floor(Math.random() * SPAWN_TYPE);
      const posX = Math.random() * SCREEN_WIDTH;
      const posY = Math.random() * (SPAWN_HEIGHT + SPAWN_HEIGHT_RANGE) - SPAWN_HEIGHT;
      const rotate = Math.random() * SPAWN_ANGLE;
      let spawnObject;
      switch (objectType) {
        case 1: // 三角形
          spawnObject = Bodies.polygon(posX, posY, 3, SPAWN_SIZE, { rotate });
          break
        case 2: // 方形
          spawnObject = Bodies.rectangle(posX, posY, SPAWN_SIZE, SPAWN_SIZE, { rotate });
          break;
        default: // 円
          // 大きくなりすぎてバランス悪くなるので他のサイズから半分にしています
          spawnObject = Bodies.circle(posX, posY, SPAWN_SIZE / 2, { rotate });
          break;
      }
      Composite.add(spawnComposite, spawnObject);
    }
    return spawnComposite;
  }

  return (
    <div className="w-full h-full relative flex justify-center items-center pb-32 font-[DotGothic16]">
      <div id="Back-Object" className="w-screen h-screen absolute top-0 left-0 overflow-hidden"></div>
      <div className="z-10">
        <div className="pt-5 pb-5 pl-15 pr-15 rounded-3xl border-4 border-black text-center text-shadow-black ">
          <h1 className="text-5xl md:text-8xl my-3 mx-10 text-yellow-300">Pythagora<br />maker</h1>
        </div>
        <p>このゲームはPC専用です。PCで遊んでね！</p>
      </div>
    </div>
  );
};
export default MobileHomePage;
