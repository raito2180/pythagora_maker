import { ObjectPalette } from "components/ObjectPalette"
import { StageEditor } from "components/StageEditor"

export const GameMake = () => {

  return (
    <div className="w-[1280px] h-[720px] m-auto font-semibold">
      <div className="w-full m-auto mt-14">
        <h1 className="text-5xl">Create</h1>
      </div>
      <div className="w-full m-auto mt-2 flex">
        <h2 className="text-2xl">Title:</h2>
        <input
          type="text"
          className="w-full ml-4 border-2 border-gray-500 rounded-md"
          placeholder="Title"
        />
      </div>
      <div className="w-full h-full m-auto mt-2 flex flex-col">
        <div className="w-full m-auto flex">
          <div className="flex-grow h-full mr-4 flex flex-col bg-white">
            <h2 className="text-1xl border-2 border-gray-500">オブジェクトパレット</h2>
            <ObjectPalette />
          </div>
          <div className="mr-4 flex flex-col bg-white">
            <h2 className="text-1xl border-2 border-gray-500">ステージエディタ</h2>
            <StageEditor />
          </div>
          <div className="flex flex-col bg-white">
            <h2 className="text-1xl border-2 border-gray-500">処理</h2>
            <div className="w-[200px] h-[496px] border-b-2 border-r-2 border-l-2 border-gray-500">
              c
            </div>
          </div>
        </div>
        <div className="w-full flex-grow m-auto mt-4 flex">
          <div className="w-4/6 h-full mr-4 flex flex-col bg-white">
            <h2 className="text-1xl border-2 border-gray-500">ユーザーオブジェクト</h2>
            <div className="h-full border-b-2 border-r-2 border-l-2 border-gray-500">
              d
            </div>
          </div>
          <div className="w-2/6 h-full flex flex-col bg-white">
            <h2 className="text-1xl border-2 border-gray-500">物理設定</h2>
            <div className="h-full border-b-2 border-r-2 border-l-2 border-gray-500">
              g
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}