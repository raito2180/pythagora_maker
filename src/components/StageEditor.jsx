import {
  useEffect,
  useRef,
  useState
} from "react";
import {
  Engine,
  Render,
  Runner,
  Composite
} from "matter-js";
import {
  StageEditorWidth,
  StageEditorHeight,
  ObjectType,
  StageEditorWall,
  StageEditorSecondWallX,
  StageEditorFirstWallX
} from "utils/GameSetting";
import {
  createObject,
  createObjects
} from "utils/matterjs/objects/CreateObjects";
import { PaletteObjects } from "utils/PaletteObjects";
import { MouseEvents } from "utils/matterjs/MouseEvents";

export const StageEditor = () => {
  const engineRef = useRef();
  const dragObjectRef = useRef();
  const [isMouseOnStage, setIsMouseOnStage] = useState(false);
  const isDragObjectRef = useRef(false);
  const mouseClickPosition = useRef({ x: 0, y: 0 });
  const selectObjectRef = useRef(null);
  const getSelectObjectParent = () =>
      selectObjectRef.current ? selectObjectRef.current.getParent() : null;
  const HALF_SCALE = 0.5;
  const MULTIPLY_SCALE = 2;
  const SELECT_OBJECT_OUTLINE_WIDTH = 5;

  useEffect(() => {
    if (selectObjectRef.current === null || isDragObjectRef.current === false)
      return;
    let parent = getSelectObjectParent();
    if (isMouseOnStage) {
      parent.multiplyScale(MULTIPLY_SCALE);
      return;
    }
    parent.multiplyScale(HALF_SCALE);
  }, [isMouseOnStage]);

  useEffect(() => {
    engineRef.current = Engine.create();
    const render = Render.create(
      {
        element: document.getElementById("stageEditor"),
        engine: engineRef.current,
        options: {
          width: StageEditorWidth,
          height: StageEditorHeight,
          wireframes: false,
          background: "white"
        }
      }
    );

    // 仕切り壁を配置
    const wallObjects = createObjects(StageEditorWall, ObjectType.Wall);
    wallObjects.forEach((object) => {
      const wall = object.getObject();
      wall.render.lineWidth = 3;
      wall.render.strokeStyle = "black";
      Composite.add(engineRef.current.world, wall);
    });

    // オブジェクトパレットにオブジェクトを配置
    const paletteObjects = createObjects(PaletteObjects, ObjectType.User);
    paletteObjects.forEach((object) => {
      Composite.add(engineRef.current.world, object.getObject());
    });

    // キャンバスの外周に影をつける
    const canvas = render.canvas;
    canvas.style.boxShadow = "inset 0 -2px 0 0 #000, inset -2px 0 0 0 #000, inset 2px 0 0 0 #000";

    const mouseEvents = new MouseEvents(render, engineRef.current);
    mouseEvents.onEvents(handleClick, handleDrag, handleClickUp);

    Render.run(render);
    Runner.run(Runner.create(), engineRef.current);
  }, []);

  const handleClick = (e) => {
    const target = e.source.body;

    // クリックしたオブジェクトがユーザーが配置できるオブジェクトなら選択する
    if (setSelectObject(target)) {
      const diff_x = e.mouse.position.x - target.position.x;
      const diff_y = e.mouse.position.y - target.position.y;
      mouseClickPosition.current = { x: diff_x, y: diff_y };
    }
  };

  const setSelectObject = (target) => {
    if (target == null) {
      if (selectObjectRef.current) {
        selectObjectRef.current.render.lineWidth = 0;
      }
      selectObjectRef.current = null;
      return false;
    }
    if (selectObjectRef.current && target !== selectObjectRef.current) {
      selectObjectRef.current.render.lineWidth = 0;
    }
    // ユーザーが配置できるオブジェクトは選択時に赤く縁取る
    target.render.lineWidth = SELECT_OBJECT_OUTLINE_WIDTH;
    target.render.strokeStyle = "red";
    selectObjectRef.current = target;
    return true;
  };

  const handleDrag = (e) => {
    setIsMouseOnStage(e.source.mouse.position.x < StageEditorSecondWallX && e.source.mouse.position.x > StageEditorFirstWallX);
    const target = e.source.body;
    if (!target) return;

    isDragObjectRef.current = true;
    dragObjectRef.current = target;

    if (!dragObjectRef.current.isStatic) return;

    // パレット上のオブジェクトをドラッグしたら複製する
    if (e.source.mouse.position.x > StageEditorSecondWallX) cloneObject(dragObjectRef.current);

    if (selectObjectRef.current && selectObjectRef.current === dragObjectRef.current) {
      const position = e.source.mouse.position;
      const x = position.x - mouseClickPosition.current.x;
      const y = position.y - mouseClickPosition.current.y;
      // FIX : たまに座標がずれるかも
      const parent = getSelectObjectParent();
      parent.setPosition({ x, y });
    }
  };

  const handleClickUp = (e) => {
    if (e.source.mouse.position.x > StageEditorSecondWallX && dragObjectRef.current) {
      Composite.remove(engineRef.current.world, dragObjectRef.current);
    }
    isDragObjectRef.current = false;
    dragObjectRef.current = null;
  };
  
  const cloneObject = (object) => {
    const label = object.label;
    PaletteObjects.forEach((paletteObject) => {
      if (paletteObject.option.label === label) {
        const clone = createObject(paletteObject, ObjectType.User).getObject();
        Composite.add(engineRef.current.world, clone);
        return clone;
      }
    });
  }

  return (
    <div id="stageEditor"></div>
  );
}