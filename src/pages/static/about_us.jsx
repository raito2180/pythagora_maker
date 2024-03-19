import { useEffect, useRef, useState } from "react";
import { GameHeight, GameWidth, ObjectType } from "utils/GameSetting";
import { MatterEngine } from "utils/matterjs/MatterEngine"
import { createObject, createObjects } from "utils/matterjs/objects/CreateObjects";
import { MouseEvents } from "utils/matterjs/MouseEvents";
import { CollisionEvents } from "utils/matterjs/CollisionEvents";
// われらのがぞう
import bodoAvatar from "../../assets/imgs/circle/stage1/13.png"
import yyAvatar from '../../assets/imgs/circle/stage1/19.png';
import uutanAvatar from '../../assets/imgs/circle/stage1/16.png';
import mattaAvatar from '../../assets/imgs/circle/stage1/18.png';
import topiAvatar from '../../assets/imgs/circle/stage1/10.png';

const AboutUs = () => {
  const matterEngineRef = useRef(null);
  const mouseEventsRef = useRef(null);
  const collisionEventsRef = useRef(null);
  const selectedObjectsRef = useRef([]);
  const compositeRef = useRef(null);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    matterInitialize();

    return () => {
      // クリーンアップ
      collisionEventsRef.current && collisionEventsRef.current.clear();
      mouseEventsRef.current && mouseEventsRef.current.clear();
      matterEngineRef.current && matterEngineRef.current.clear();
    }
  }, []);

  useEffect(() => {
    if (!allSelected) return;
    const comments = document.querySelectorAll(".member");
    comments.forEach(comment => {
      comment.classList.add("opacity-0");
    });

    const spawnTimeoutId = setTimeout(() => {
      // オブジェクトスポーン
      spawnObjects();
      const stackTimeoutId = setTimeout(() => {
        // 技術stack表示
        const stack = document.querySelector(".stack");
        stack.classList.add("opacity-100");
        clearTimeout(spawnTimeoutId);
        clearTimeout(stackTimeoutId);
      }, 3000);
    }, 1500);

  }, [allSelected]);

  const matterInitialize = () => {
    const matterEngine = new MatterEngine();
    matterEngine.setup("#about");
    matterEngineRef.current = matterEngine;

    const circleObjects = createObjects([bodoNiki, yy, uutan, matta, topi], ObjectType.User);
    const composite = matterEngine.createComposite();
    compositeRef.current = composite;

    // われらのがぞうをセット
    circleObjects[0].setTexture(bodoAvatar);
    circleObjects[1].setTexture(yyAvatar);
    circleObjects[2].setTexture(uutanAvatar);
    circleObjects[3].setTexture(mattaAvatar);
    circleObjects[4].setTexture(topiAvatar);

    const mouseEvents = new MouseEvents(
      matterEngine.getRender(),
      matterEngine.getEngine()
    );
    mouseEvents.onEvents(handleClick);
    mouseEventsRef.current = mouseEvents;
    matterEngine.setRenderMouse(mouseEvents.getMouse());

    const collisionEvents = new CollisionEvents(matterEngine.getEngine());
    collisionEvents.registerCollisionStartEvent(collisionTouch);
    collisionEvents.onTouchEvents();
    collisionEventsRef.current = collisionEvents;

    matterEngine.registerObject([...circleObjects, composite, createObject(ground, ObjectType.Wall), mouseEvents.getMouseConstraint(),]);

    matterEngine.run();
  }

  // クリックしたらオブジェクトを物理に変更
  const handleClick = (e) => {
    const target = e.source.body;
    if (!target || !target.isStatic) return;
    target.getParent().setStatic(false);
    selectedObjectsRef.current.push(target.label);
    setAllSelected(selectedObjectsRef.current.length === 5);
  }

  // オブジェクト同士が触れたら物理を変更
  const collisionTouch = (bodyA, bodyB) => {
    // 床が落ちないようにする
    if (bodyA.label === "stage" || bodyB.label === "stage") {
      return;
    }
    bodyA.getParent().setStatic(false);
    bodyB.getParent().setStatic(false);
  }

  const spawnObjects = () => {
    let spawnObjects = [];
    const SPAWN_HEIGHT = 700;
    const SPAWN_HEIGHT_RANGE = 50;
    const SPAWN_ANGLE = 360;
    const SPAWN_SIZE = 50;
    for (let i = 0; i < 50; i++) {
      const posX = Math.random() * GameWidth;
      const posY = Math.random() * (SPAWN_HEIGHT + SPAWN_HEIGHT_RANGE) - SPAWN_HEIGHT;
      const rotate = Math.random() * SPAWN_ANGLE;
      const circle = {
        theme: "",
        bodiesType: "Circle",
        x: posX,
        y: posY,
        type: "",
        radius: SPAWN_SIZE / 2,
        option: {
          angle: rotate,
        }
      }
      const spawnObject = createObject(circle, ObjectType.User);
      spawnObjects.push(spawnObject);
    }
    matterEngineRef.current.registerObjectInComposite(compositeRef.current, spawnObjects);
  }

  return (
    <article className="m-auto mt-[56px]">
      <h2 className="text-3xl text-center font-[DotGothic16]">About us ...</h2>
      <div id="about" className="w-[1200px] h-full m-auto relative z-10 mt-6">
        <div className="absolute left-0 top-0 w-full he-full z-[-1]">
          <section className="member absolute left-[237px] top-[180px] h-[160px] bg-white py-3 px-6 rounded before:content[''] before:absolute before:top-[-28px] before:left-[45%] before:border-[15px] before:border-transparent before:border-b-[15px] before:border-b-white transition duration-500">
            <h4 className="text-center font-semibold">ボド</h4>
            <p className="my-2">ボードゲームよりは3度の飯🎲<br />
              元医療系webエンジニア見習いのボドです✨️<br />
              RUNTEQ祭楽しんでる〜？？🥳🎊
            </p>
          </section>
          <section className="member absolute left-[645px] top-[180px] h-[160px] bg-white py-3 px-6 rounded before:content[''] before:absolute before:top-[-28px] before:left-[45%] before:border-[15px] before:border-transparent before:border-b-[15px] before:border-b-white transition duration-500">
            <h4 className="text-center font-semibold">YY</h4>
            <p className="my-2">ゲームをこよなく愛する<br />元エンジニアかつ現エンジニア見習いです！<br />
              主に編集画面を頑張って作りました！<br />(バグだらけ？ははは...)</p>
          </section>
          <section className="member absolute left-[50px] top-[530px] h-[140px] bg-white py-3 px-6 rounded before:content[''] before:absolute before:top-[-28px] before:left-[45%] before:border-[15px] before:border-transparent before:border-b-[15px] before:border-b-white transition duration-500">
            <h4 className="text-center font-semibold">うぅたん</h4>
            <p className="my-2">主にステージセレクト画面の実装を担当しました！<br />チーム開発最高っ！<br />
              みんなもどんどんチーム開発していこ〜💪</p>
          </section>
          <section className="member absolute left-[455px] top-[530px] h-[140px] bg-white py-3 px-6 rounded before:content[''] before:absolute before:top-[-28px] before:left-[45%] before:border-[15px] before:border-transparent before:border-b-[15px] before:border-b-white transition duration-500">
            <h4 className="text-center font-semibold">MaTTa</h4>
            <p className="my-2">からあげとアニメさえあれば生きていける<br />中年データサイエンティストです！！<br />
              アプリイベント楽しもう〜！！</p>
          </section>
          <section className="member absolute left-[790px] top-[530px] h-[140px] bg-white py-3 px-6 rounded before:content[''] before:absolute before:top-[-28px] before:left-[45%] before:border-[15px] before:border-transparent before:border-b-[15px] before:border-b-white transition duration-500">
            <h4 className="text-center font-semibold">とぴ</h4>
            <p className="my-2">一応元ゲームプログラマ、ここに見参！<br />楽しんでいただけたら嬉しいです～<br />ちなみに全員のアイコンをクリックすると…？</p>
          </section>
        </div>
      </div>
      <div className="fixed left-0 top-0 w-full h-full m-auto text-center font-[DotGothic16] transition duration-200 opacity-0  stack">
        <h2 className="text-8xl mt-32">MYゆうぅとぴあ</h2>
        <section className="mt-16 bg-green-300 w-[320px] m-auto p-3 py-5 rounded">
          <h3 className="text-4xl mb-5">技術スタック</h3>
          <div className="text-2xl leading-3">
            <p>React</p>
            <p>JavaScript</p>
            <p>Vercel</p>
            <p>Supabase</p>
            <p>Docker</p>
            <p>Tailwind CSS</p>
            <p>matter.js</p>
          </div>
        </section>
      </div>
    </article>
  )
}

export default AboutUs;

const POSITION_Y_TOP = 100;
const POSITION_Y_BOTTOM = 450;
const CIRCLE_RADIUS = 88;

const bodoNiki = {
  theme: "",
  bodiesType: "Circle",
  x: GameWidth / 3,
  y: POSITION_Y_TOP,
  type: "",
  radius: CIRCLE_RADIUS,
  option: {
    label: "bodo",
    isStatic: true,
  },
}

const yy = {
  theme: "",
  bodiesType: "Circle",
  x: GameWidth - (GameWidth / 3),
  y: POSITION_Y_TOP,
  type: "",
  radius: CIRCLE_RADIUS,
  option: {
    isStatic: true,
    render: {
      label: "yy",
    },
  },
}

const uutan = {
  theme: "",
  bodiesType: "Circle",
  x: (GameWidth / 4) - 75,
  y: POSITION_Y_BOTTOM,
  type: "",
  radius: CIRCLE_RADIUS,
  option: {
    isStatic: true,
    label: "uutan",
  },
}

const matta = {
  theme: "",
  bodiesType: "Circle",
  x: GameWidth / 2,
  y: POSITION_Y_BOTTOM,
  type: "",
  radius: CIRCLE_RADIUS,
  option: {
    isStatic: true,
    label: "matta",
  },
}

const topi = {
  theme: "",
  bodiesType: "Circle",
  x: (GameWidth / 2) + (GameWidth / 4) + 45,
  y: POSITION_Y_BOTTOM,
  type: "",
  radius: CIRCLE_RADIUS,
  option: {
    isStatic: true,
    label: "topi",
  },
}

const ground = {
  theme: "",
  bodiesType: "Rectangle",
  x: GameWidth / 2,
  y: GameHeight + 15,
  type: "stage",
  width: GameWidth,
  height: 30,
  option: {
    isStatic: true,
    label: "stage",
    render: {
      fillStyle: "transparent",
    }
  },
}