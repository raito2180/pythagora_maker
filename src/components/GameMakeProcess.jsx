export const GameMakeProcess = () => {
  return (
    <div className="h-full flex border-b-2 border-r-2 border-l-2 border-black">
      <div className="w-1/2 flex-col h-full">
        <button className="w-full h-1/2 border-b-2 border-r-2 border-black">テストプレイ</button>
        <button className="w-full h-1/2 border-r-2 border-black">ステージ削除</button>
      </div>
      <div className="w-1/2 flex-col h-full">
        <button className="w-full h-1/2 border-b-2 border-black">保存</button>
        <button className="w-full h-1/2">公開する！</button>
      </div>
    </div>
  );
}