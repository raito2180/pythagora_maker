import { Query } from "matter-js";
import {
  StageEditorFirstWallX,
  StageEditorSecondWallX,
  StageEditorWall,
  StageEditorHeight,
  StageStartX,
  StageEndX
} from "utils/GameSetting";

export const GameMakeProcess = ({ engine }) => {
  // 保存ボタンの処理
  const handleSaveClick = () => {
    if (!engine.world || !engine.world.bodies) return;

    // 保存する範囲
    const region = {
      min: { x: StageStartX, y: 0 },
      max: { x: StageEndX, y: StageEditorHeight }
    }

    // 範囲内のオブジェクトを取得
    const objects = Query.region(engine.world.bodies, region).filter((body) => body.label !== "wall");

    console.log(objects);
  };

  return (
    <div className="h-full flex border-b-2 border-r-2 border-l-2 border-black">
      <div className="w-1/2 flex-col h-full">
        <button className="w-full h-1/2 border-b-2 border-r-2 border-black">テストプレイ</button>
        <button className="w-full h-1/2 border-r-2 border-black">***</button>
      </div>
      <div className="w-1/2 flex-col h-full">
        <button onClick={handleSaveClick} className="w-full h-1/2 border-b-2 border-black">保存</button>
        <button className="w-full h-1/2">***</button>
      </div>
    </div>
  );
}