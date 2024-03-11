import { useEffect, useRef } from "react"
import { createObjects } from "utils/matterjs/objects/CreateObjects"
import { ObjectType } from "utils/GameSetting"
import { PaletteObjects } from "utils/PaletteObjects"
import { MouseEvents } from "utils/matterjs/MouseEvents"
import { Engine, Render, Composite, Runner } from "matter-js"

export const ObjectPalette = () => {
  const selectObjectRef = useRef(null);
  const SELECT_OBJECT_OUTLINE_WIDTH = 5;

  useEffect(() => {

    const paletteObjects = createObjects(PaletteObjects, ObjectType.User)
    const engine = Engine.create({
      enableSleeping: true,
      gravity: {
        x: 0,
        y: 0
      }
    });

    const render = Render.create({
      element: document.getElementById("object"),
      engine: engine,
      options: {
        width: 461,
        height: 496,
        wireframes: false,
        background: "transparent"
      }
    });

    const mouseEvents = new MouseEvents(render, engine);
    mouseEvents.onClickEvent(handleClick);

    paletteObjects.forEach((object) => {
      Composite.add(engine.world, object.getObject());
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);
  }, []);

  const handleClick = (e) => {
    const target = e.source.body;
    if (target == null || !target.label.match(/user(.*)/g)) {
      if (selectObjectRef.current) {
        selectObjectRef.current.render.lineWidth = 0;
      }
      selectObjectRef.current = null;
      return;
    }
    if (selectObjectRef.current && target !== selectObjectRef.current) {
      selectObjectRef.current.render.lineWidth = 0;
    }
    // ユーザーが配置できるオブジェクトは選択時に赤く縁取る
    target.render.lineWidth = SELECT_OBJECT_OUTLINE_WIDTH;
    target.render.strokeStyle = "red";
    selectObjectRef.current = target;
  }

  return (
    <div id="object" className="w-[461px] h-[496px] border-b-2 border-r-2 border-l-2 border-gray-500"></div>
  );
};
