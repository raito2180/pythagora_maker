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
  PythagoraStartX,
  StageEditorWidth,
  StageEditorHeight,
  StageEditorUserPlacementCenterX,
  ObjectType,
  StageEditorWall,
  StageStartX,
  StageEndX
} from "utils/GameSetting";
import {
  createObject,
  createObjects
} from "utils/matterjs/objects/CreateObjects";
import { PaletteObjects } from "utils/PaletteObjects";
import { MouseEvents } from "utils/matterjs/MouseEvents";

export const StageEditor = ({
  engine,
  gameData,
  setGameData,
  selectObjectRef,
  setSelectObjectX,
  setSelectObjectY,
  setSelectObjectType,
  stageId
}) => {
  const isMouseDownRef = useRef(false);
  const isBeforeOnStageRef = useRef(false);
  const mouseClickPositionRef = useRef({ x: 0, y: 0 });
  const EDIT_SCALE = 2 / 3;
  const HALF_SCALE = 1 / 2;
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

    // キャンバスの外周に影をつける
    const canvas = render.canvas;
    canvas.style.boxShadow = "inset 0 -2px 0 0 #000, inset -2px 0 0 0 #000, inset 2px 0 0 0 #000";

    const mouseEvents = new MouseEvents(render, engine);
    mouseEvents.onEvents(handleClick, handleDrag, handleClickUp);

    Render.run(render);
    Runner.run(Runner.create(), engine);

    return () => {
      Render.stop(render);
      Runner.stop(engine);
      mouseEvents.clear();
    }
  }, [engine]);

  useEffect(() => {

    if (!engine || !gameData) return;

    // ボールデータを生成
    if (gameData.content && gameData.content.Ball) {
      const ballObjects = createObjects(gameData.content.Ball, ObjectType.Ball);
      ballObjects.forEach((object) => {
        changeScale(object);
        Composite.add(engine.world, object.getObject());
      });
    }

    // スイッチデータを生成
    if (gameData.content && gameData.content.Switch) {
      const switchObject = createObject(gameData.content.Switch, ObjectType.Switch);
      changeScale(switchObject);
      Composite.add(engine.world, switchObject.getObject());
    }

    // ステージデータを生成
    if (gameData.content && gameData.content.Stage) {
      const stageObjects = createObjects(gameData.content.Stage, ObjectType.Stage);
      stageObjects.forEach((object) => {
        changeScale(object);
        Composite.add(engine.world, object.getObject());
      });
    }

    // ユーザーオブジェクトデータをステージオブジェクトとして生成
    if (gameData.content && gameData.content.UserPlacement) {
      const userObjects = createObjects(gameData.content.UserPlacement, ObjectType.Stage);
      userObjects.forEach((userObject) => {
        // 動くと面倒なので静的オブジェクトに設定
        userObject.setStatic(true);
        changeScale(userObject);
        userObject.multiplyScale(HALF_SCALE);
        const position = userObject.getPosition();
        userObject.setPosition({ x: StageEditorUserPlacementCenterX, y: position.y });
        const object = userObject.getObject();
        // ユーザーオブジェクトはステージオブジェクトとして配置
        object.objectType = ObjectType.Stage;
        Composite.add(engine.world, object);
      });
    }

    // 仕切り壁を配置
    const wallObjects = createObjects(StageEditorWall, ObjectType.Wall);
    wallObjects.forEach((object) => {
      const wall = object.getObject();
      wall.render.lineWidth = 3;
      wall.render.strokeStyle = "black";
      Composite.add(engine.world, wall);
    });

    // オブジェクトパレットにオブジェクトを配置
    PaletteObjects.forEach((paletteObject) => {
      const object = createObject(paletteObject, paletteObject.objectType);
      object.multiplyScale(EDIT_SCALE);
      object.multiplyScale(HALF_SCALE);
      Composite.add(engine.world, object.getObject());
    });

  }, [engine, gameData]);

  // オブジェクトをクリックしたときの処理
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

  // オブジェクトを選択したときの処理
  const setSelectObject = (target) => {
    if (target == null || target.label === "wall") {
      if (selectObjectRef.current) {
        selectObjectRef.current.render.lineWidth = 0;
      }
      selectObjectRef.current = null;
      setSelectObjectX(null);
      setSelectObjectY(null);
      setSelectObjectType(null);
      return false;
    }
    if (selectObjectRef.current && target !== selectObjectRef.current) {
      selectObjectRef.current.render.lineWidth = 0;
    }
    // ユーザーが配置できるオブジェクトは選択時に赤く縁取る
    target.render.lineWidth = SELECT_OBJECT_OUTLINE_WIDTH;
    target.render.strokeStyle = "red";
    selectObjectRef.current = target;

    // ステージ内のオブジェクトを選択したら座標をセット
    setSelectObjectXY(target.position.x, target.position.y);

    setSelectObjectType(target.bodiesType);

    return true;
  };

  // オブジェクトをドラッグしたときの処理
  const handleDrag = (e) => {
    // クリック状態でなければ処理しない
    if (!isMouseDownRef.current) return;

    const target = e.source.body;
    if (!target || !target.isStatic || !selectObjectRef.current) return;

    const position = e.source.mouse.position;
    let x = position.x - mouseClickPositionRef.current.x;
    let y = position.y - mouseClickPositionRef.current.y;

    // オブジェクトがステージ外に出ないようにする
    y = y < 0 ? 0 : y;
    y = y > StageEditorHeight ? StageEditorHeight : y;

    const parent = selectObjectRef.current.getParent();

    // パレットに存在しないオブジェクトはパレットに移動できないようにする
    if (!parent.object.label.startsWith("Palette")) {
      x = isOnPalette(x) ? StageEndX : x;
    }

    parent.setPosition({ x, y });

    setSelectObjectXY(x, y);

    // ドラッグ前後でステージから出入りした場合はスケールを変更
    if (isBeforeOnStageRef.current === isOnStage(x)) return;

    if (isBeforeOnStageRef.current) {
      parent.multiplyScale(HALF_SCALE);
      isBeforeOnStageRef.current = false;
      return;
    }
    parent.multiplyScale(MULTIPLY_SCALE);
    isBeforeOnStageRef.current = true;
  };

  // オブジェクトをドラッグ終了したときの処理
  const handleClickUp = () => {
    const objectPosition = selectObjectRef.current ? selectObjectRef.current.getParent().getPosition() : { x: 0, y: 0 };
    isMouseDownRef.current = false;
    // ドラッグしたオブジェクトがパレット内にある場合は削除
    if (selectObjectRef.current && isOnPalette(objectPosition.x)) {
      Composite.remove(engine.world, selectObjectRef.current);
      selectObjectRef.current = null;
      setSelectObjectXY(null, null);
      setSelectObjectType(null);
      return;
    }
    setSelectObjectXY(objectPosition.x, objectPosition.y);
  };

  // データベースから読み込んだオブジェクトの座標および大きさを編集画面に合わせて変更
  const changeScale = (object) => {
    const position = object.getPosition();
    const posX = Math.round(((position.x - PythagoraStartX) * EDIT_SCALE) + StageStartX);
    const posY = Math.round(position.y * EDIT_SCALE);
    object.setPosition({ x: posX, y: posY });
    object.multiplyScale(EDIT_SCALE);
  }


  // オブジェクトを複製
  const cloneObject = (object) => {
    const label = object.label;
    PaletteObjects.forEach((paletteObject) => {
      if (paletteObject.option.label === label) {
        const clone = createObject(paletteObject, paletteObject.objectType);
        clone.multiplyScale(EDIT_SCALE);
        clone.multiplyScale(HALF_SCALE);
        Composite.add(engine.world, clone.getObject());
        return clone;
      }
    });
  }

  // フックに座標をセット
  const setSelectObjectXY = (x, y) => {
    setSelectObjectX(x);
    setSelectObjectY(y);
  }

  // x座標がステージ上にあるか判定
  const isOnStage = (x) => {
    return x >= StageStartX && x <= StageEndX;
  }

  // x座標がパレット上にあるか判定
  const isOnPalette = (x) => {
    return x > StageEndX;
  }

  return (
    <div id="stageEditor"></div>
  );
}