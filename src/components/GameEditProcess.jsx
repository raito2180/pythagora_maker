import {
  PythagoraStartX,
  UserPlacementCenterX,
  StageEditorFirstWallX,
  StageEditorHeight,
  StageStartX,
  StageEndX
} from "utils/GameSetting";
import { State } from "utils/GameSetting";
import { updateStage } from "services/supabaseStages";

export const GameEditProcess = ({
  engine,
  stageId,
  gameData
}) => {
  const GAME_SCALE = 3/2;
  // 保存の丸め誤差の修正値
  const ROUNDING_ERROR_ADJUST = 13;

  // 保存ボタンの処理
  const handleSaveClick = () => {
    if (!engine.world || !engine.world.bodies) return;

    // ステージ内のオブジェクトを取得
    const stageObjects = getStageObjects(engine.world.bodies);

    // プロパティを取得(ボールとスイッチは1つずつ、ステージは複数)
    let retBall = [];
    let retStages = [];
    let retSwitch = [];

    stageObjects.forEach((object) => {
      if (object.objectType === "Ball") {
        retBall.push(returnStageProperty(object));
        return;
      }

      if (object.objectType === "Stage") {
        retStages.push(returnStageProperty(object));
        return;
      }

      if (object.objectType === "Switch") {
        retSwitch.push(returnStageProperty(object));
        return;
      }
    });

    // ボールもしくはスイッチが2つ以上ある場合はエラー
    if (retBall.length >= 2) {
      window.alert("ボールは1つだけ設置できます");
      return;
    }
    if (retSwitch.length >= 2) {
      window.alert("スイッチは1つだけ設置できます");
      return;
    }

    // ユーザーオブジェクトのプロパティを取得
    const userPlacements = getUserPlacements(engine.world.bodies);

    let retUserPlacements = [];

    userPlacements.forEach((object) => {
      retUserPlacements.push(returnUserProperty(object));
    });

    let properties = {};

    if (retBall.length > 0) properties.Ball = retBall[0];
    if (retStages.length > 0) properties.Stage = retStages;
    if (retSwitch.length > 0) properties.Switch = retSwitch[0];
    if (retUserPlacements.length > 0) properties.UserPlacement = retUserPlacements;

    updateData(stageId, properties);
  };

  // ステージデータを更新
  const updateData = async (stageId, properties) => {
    const { error } = await updateStage(stageId, properties);

    // TODO: エラー処理
    if (error) {
      console.error(error);
      return;
    }
    window.location.reload();
  };

  // ステージ内のオブジェクトを取得
  const getStageObjects = (bodies) => {
    return bodies.filter((body) => {
      if (body.label === "wall") return false;
      
      const position = body.position;
      return position.x >= StageStartX
        && position.x <= StageEndX
        && position.y >= 0
        && position.y <= StageEditorHeight;
    });
  }

  // ユーザーオブジェクトを取得
  const getUserPlacements = (bodies) => {
    return bodies.filter((body) => {
      if (body.label === "wall") return false;

      const position = body.position;
      return position.x >= 0
        && position.x < StageStartX
        && position.y >= 0
        && position.y <= StageEditorHeight;
    });
  }

  // ステージエディタのプロパティをゲーム画面のプロパティに変換
  const returnStageProperty = (object) => {
    const position = changePosition(object.position);
    const isStatic = object.isStatic;
    const objectId = object.id;
    const bodiesType = object.bodiesType;
    const objectType = object.objectType;

    // ラベルは小文字にしないといけないので変換
    let label = null;

    if (objectType === 'Switch') label = 'switch';

    if (objectType === 'Stage') label = 'stage';

    if (objectType === 'Ball') label = 'ball';


    // 共通プロパティ
    let property = {
      // 丸め誤差の修正
      x: position.x - ROUNDING_ERROR_ADJUST,
      y: position.y,
      option: {
        label: label,
        isStatic: isStatic,
        objectId: objectId,
        bodiesType: bodiesType,
        objectType: objectType
      },
      bodiesType: bodiesType
    };

    // 円の場合
    if (bodiesType === 'Circle') {
      const radius = object.radius;

      property.radius = radius;
      property.option.radius = radius;
      return property;
    }

    // 長方形の場合
    if (bodiesType === 'Rectangle') {
      const width = object.width;
      const height = object.height;
      const angle = object.angle;

      property.width = width;
      property.height = height;
      property.option.width = width;
      property.option.height = height;
      property.option.angle = angle;
      return property;
    }

    // 三角形の場合
    if (bodiesType === 'Triangle') {
      const height = object.height;
      const angle = object.angle;

      property.height = height;
      property.option.height = height;
      property.option.angle = angle;
      return property;
    }

    // 多角形の場合
    const sides = object.sides;
    const radius = object.radius;
    const angle = object.angle;

    property.sides = sides;
    property.radius = radius;
    property.option.sides = sides;
    property.option.radius = radius;
    property.option.angle = angle;
    return property;
  };

  // ユーザーオブジェクトのプロパティをゲーム画面のプロパティに変換
  const returnUserProperty = (object) => {
    const position = changePosition(object.position);
    position.x = UserPlacementCenterX
    const isStatic = object.isStatic;
    const objectId = object.id;
    const bodiesType = object.bodiesType;
    const objectType = object.objectType;
    const label = 'userStatic';

    // 共通プロパティ
    let property = {
      x: position.x,
      y: position.y,
      option: {
        label: label,
        isStatic: isStatic,
        objectId: objectId,
        bodiesType: bodiesType,
        objectType: objectType
      },
      bodiesType: bodiesType
    };

    // 円の場合
    if (bodiesType === 'Circle') {
      const radius = object.radius;

      property.radius = radius;
      property.option.radius = radius;
      return property;
    }

    // 長方形の場合
    if (bodiesType === 'Rectangle') {
      const width = object.width;
      const height = object.height;
      const angle = object.angle;

      property.width = width;
      property.height = height;
      property.option.width = width;
      property.option.height = height;
      property.option.angle = angle;
      return property;
    }

    // 三角形の場合
    if (bodiesType === 'Triangle') {
      const height = object.height;
      const angle = object.angle;

      property.height = height;
      property.option.height = height;
      property.option.angle = angle;
      return property;
    }

    // 多角形の場合
    const sides = object.sides;
    const radius = object.radius;
    const angle = object.angle;

    property.sides = sides;
    property.radius = radius;
    property.option.sides = sides;
    property.option.radius = radius;
    property.option.angle = angle;
    return property;
  };

  // オブジェクトの座標をステージエディタのスケールからゲーム画面のスケールに変換
  const changePosition = (position) => {
    const posX = Math.round(((position.x - StageEditorFirstWallX) * GAME_SCALE) + PythagoraStartX);
    const posY = Math.round(position.y * GAME_SCALE);
    return { x: posX, y: posY };
  };

  return (
    <div className="w-full h-full flex flex-col border-b-2 border-r-2 border-l-2 border-black">
      <div className="w-full h-1/2 border-b-2 border-black">
        <button className="w-1/2 h-full border-r-2 border-black">テストプレイ</button>
        <button onClick={handleSaveClick} className="w-1/2 h-full">保存</button>
      </div>
      {(gameData && gameData.state === State.untested) && (
        <div className="w-full h-1/2 flex items-center justify-center bg-red-500">
          <h2>テスト未完了(公開できません！)</h2>
        </div>
      )}
      {(gameData && gameData.state === State.private) && (
        <div className="w-full h-1/2 flex items-center justify-center bg-green-500">
          <h2>テスト済(公開できます！)</h2>
        </div>
      )}
      {(gameData && gameData.state === State.release) && (
        <div className="w-full h-1/2 flex items-center justify-center bg-green-500">
          <h2>テスト済(公開中です！)</h2>
        </div>
      )}
    </div>
  );
}