// 公開状況
// NOTE : enumはTypeScriptの書き方になるので、ここでは使えない
export const State = {
  untested: "未テスト",
  release: "公開",
  private: "非公開",
}

// ゲーム画面
export const GameWidth = 1200;
export const GameHeight = 800 - 56; // 高さ - 親要素のmtのpx

// ユーザー配置とピタゴラスペースの仕切りX座標
export const WallX = 304;

// ユーザー配置の中心X座標
export const UserPlacementCenterX = WallX / 2;

// ユーザー配置を囲うボックス
export const UserPlacementBox = [
  {
    bodiesType: "Rectangle",
    x: WallX,
    y: GameHeight / 2,
    width: 30,
    height: GameHeight,
    option: {
      isStatic: true,
      collisionFilter: {
        group: -1
      },
      label: "wall"
    }
  },
  {
    bodiesType: "Rectangle",
    x: WallX / 2,
    y: GameHeight - 15, // 高さ - オブジェクトの高さの半分
    width: WallX,
    height: 30,
    option: {
      isStatic: true,
      collisionFilter: {
        group: -1
      },
      label: "wall"
    }
  },
  {
    bodiesType: "Rectangle",
    x: -30,
    y: GameHeight / 2,
    width: 30,
    height: 740,
    option: {
      isStatic: true,
      collisionFilter: {
        group: -1
      },
      label: "wall"
    }
  },
  {
    bodiesType: "Rectangle",
    x: WallX / 2,
    y: -30,
    width: WallX,
    height: 30,
    option: {
      isStatic: true,
      collisionFilter: {
        group: -1
      },
      label: "wall"
    }
  },
]

// ピタゴラスペースの開始X座標
export const PythagoraStartX = WallX + (UserPlacementBox[0].width / 2);

// ステージ作成画面
export const StageEditorWidth = 1280;
export const StageEditorHeight = 496;

// 一つ目の仕切りX座標
export const StageEditorFirstWallX = 308;

// 二つ目の仕切りX座標
export const StageEditorSecondWallX = 911;

// ユーザー配置の中心X座標
export const StageEditorUserPlacementCenterX = StageEditorFirstWallX / 2;

// ステージ作成画面の仕切り
export const StageEditorWall = [
  {
    bodiesType: "Rectangle",
    x: StageEditorFirstWallX,
    y: StageEditorHeight / 2,
    width: 16,
    height: StageEditorHeight,
    option: {
      isStatic: true,
      collisionFilter: {
        group: -1
      },
      label: "wall"
    }
  },
  {
    bodiesType: "Rectangle",
    x: StageEditorSecondWallX,
    y: StageEditorHeight / 2,
    width: 16,
    height: StageEditorHeight,
    option: {
      isStatic: true,
      collisionFilter: {
        group: -1
      },
      label: "wall"
    }
  }
]

// ステージの開始X座標
export const StageStartX = StageEditorFirstWallX + (StageEditorWall[0].width / 2);

// ステージの終了X座標
export const StageEndX = StageEditorSecondWallX - (StageEditorWall[1].width / 2);

// オブジェクトの種類
export const ObjectType = {
  Stage: "Stage",
  Switch: "Switch",
  User: "User",
  Ball: "Ball",
  Wall: "Wall",
  UserPlacement: "UserPlacement"
}

// オブジェクトの配色
export const ColorSetting = {
  StageStatic: "gray",
  StageMove: "orange",
  Switch: "red",
  UserStatic: "blue",
  UserMove: "green",
  Ball: "cyan",
  Wall: "#4ADE80", // TODO 背景色と同じ
}
