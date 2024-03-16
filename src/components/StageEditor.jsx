import {
  useEffect,
  useRef
} from "react";
import {
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

export const StageEditor = ({
  engine,
  selectObjectRef
}) => {
  const isMouseDownRef = useRef(false);
  const isBeforeOnStageRef = useRef(false);
  const mouseClickPositionRef = useRef({ x: 0, y: 0 });
  const getSelectObjectParent = () =>
      selectObjectRef.current ? selectObjectRef.current.getParent() : null;
  const HALF_SCALE = 0.5;
  const MULTIPLY_SCALE = 2;
  const SELECT_OBJECT_OUTLINE_WIDTH = 5;

  useEffect(() => {
    if (!engine) return;
    const render = Render.create(
      {
        element: document.getElementById("stageEditor"),
        engine: engine,
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
      Composite.add(engine.world, wall);
    });

    // オブジェクトパレットにオブジェクトを配置
    const paletteObjects = createObjects(PaletteObjects, ObjectType.User);
    paletteObjects.forEach((object) => {
      Composite.add(engine.world, object.getObject());
    });

    // キャンバスの外周に影をつける
    const canvas = render.canvas;
    canvas.style.boxShadow = "inset 0 -2px 0 0 #000, inset -2px 0 0 0 #000, inset 2px 0 0 0 #000";

    const mouseEvents = new MouseEvents(render, engine);
    mouseEvents.onEvents(handleClick, handleDrag, handleClickUp);

    Render.run(render);
    Runner.run(Runner.create(), engine);
  }, [engine]);

  const handleClick = (e) => {
    isMouseDownRef.current = true;
    const target = e.source.body;
 
    if (!setSelectObject(target)) return;

    // クリックしたオブジェクトがユーザーが配置できるオブジェクトなら選択する
    const diff_x = e.mouse.position.x - target.position.x;
    const diff_y = e.mouse.position.y - target.position.y;
    mouseClickPositionRef.current = { x: diff_x, y: diff_y };
    
    // パレット上のオブジェクトを選択したら複製する
    if (isOnPalette(target.position.x)) cloneObject(target);

    // 選択したオブジェクトがステージ上にあるか判定
    isBeforeOnStageRef.current = isOnStage(target.position.x);
  };

  const setSelectObject = (target) => {
    if (target == null || target.label === "wall") {
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
    // クリック状態でなければ処理しない
    if (!isMouseDownRef.current) return;

    const target = e.source.body;
    if (!target || !target.isStatic) return;

    if (selectObjectRef.current) {
      const position = e.source.mouse.position;
      const x = position.x - mouseClickPositionRef.current.x;
      const y = position.y - mouseClickPositionRef.current.y;
      // FIX : たまに座標がずれるかも
      const parent = getSelectObjectParent();
      parent.setPosition({ x, y });

      // ドラッグ前後でステージから出入りした場合はスケールを変更
      if (isBeforeOnStageRef.current === isOnStage(x)) return;
      if (isBeforeOnStageRef.current) {
        parent.multiplyScale(HALF_SCALE);
        isBeforeOnStageRef.current = false;
        return;
      }
      parent.multiplyScale(MULTIPLY_SCALE);
      isBeforeOnStageRef.current = true;
    }
  };

  const handleClickUp = () => {
    // ドラッグしたオブジェクトがパレット内にある場合は削除
    if (selectObjectRef.current && getSelectObjectParent().getPosition().x > StageEditorSecondWallX) {
      Composite.remove(engine.world, selectObjectRef.current);
      selectObjectRef.current = null;
    }
    isMouseDownRef.current = false;
  };
  
  const cloneObject = (object) => {
    const label = object.label;
    PaletteObjects.forEach((paletteObject) => {
      if (paletteObject.option.label === label) {
        const clone = createObject(paletteObject, ObjectType.User).getObject();
        Composite.add(engine.world, clone);
        return clone;
      }
    });
  }

  // x座標がステージ上にあるか判定
  const isOnStage = (x) => {
    return x > StageEditorFirstWallX && x < StageEditorSecondWallX;
  }

  // x座標がパレット上にあるか判定
  const isOnPalette = (x) => {
    return x > StageEditorSecondWallX;
  }

  return (
    <div id="stageEditor"></div>
  );
}