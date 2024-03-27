import {
  useEffect,
  useState,
  useRef
} from "react"
import { useParams } from "react-router-dom"
import { Engine } from "matter-js"
import { StageEditor } from "components/StageEditor"
import { GameEditProcess } from "components/GameEditProcess"
import { GameEditSettings } from "components/GameEditSettings"

export const GameEdit = () => {
  const { id } = useParams();
  const [ engine, setEngine ] = useState(null);
  const [ gameData, setGameData ] = useState(null);
  const [ selectObjectX, setSelectObjectX ] = useState(null);
  const [ selectObjectY, setSelectObjectY ] = useState(null);
  const [ selectObjectType, setSelectObjectType ] = useState(null);
  const selectObjectRef = useRef(null);

  useEffect(() => {
    setEngine(Engine.create());
    return () => {
      engine && Engine.clear(engine);
    };
  }, []);

  return (
    <div className="w-[1280px] h-[720px] m-auto font-[DotGothic16]">
      <div className="w-full m-auto mt-14">
        <h1 className="text-5xl">Edit</h1>
      </div>
      <div className="w-full h-full m-auto mt-2 flex flex-col">
        <div className="w-full m-auto flex">
          <div className="w-[300px] mr-4 bg-white">
            <h2 className="text-1xl border-2 border-black">ユーザーオブジェクト</h2>
          </div>
          <div className="w-[587px] mr-4 bg-white">
            <h2 className="text-1xl border-2 border-black">ステージ</h2>
          </div>
          <div className="w-[361px] bg-white">
            <h2 className="text-1xl border-2 border-black">オブジェクトパレット</h2>
          </div>
        </div>
        <StageEditor
          engine={engine}
          gameData={gameData}
          setGameData={setGameData}
          selectObjectRef={selectObjectRef}
          setSelectObjectX={setSelectObjectX}
          setSelectObjectY={setSelectObjectY}
          setSelectObjectType={setSelectObjectType}
          stageId={id}
          />
        <div className="w-full grow m-auto mt-4 flex">
          <div className="w-4/6 h-full mr-4 flex flex-col bg-white">
            <h2 className="text-1xl border-2 border-black">オブジェクト設定</h2>
            <GameEditSettings
              engine={engine}
              gameData={gameData}
              selectObjectRef={selectObjectRef}
              selectObjectX={selectObjectX}
              setSelectObjectX={setSelectObjectX}
              selectObjectY={selectObjectY}
              setSelectObjectY={setSelectObjectY}
              selectObjectType={selectObjectType}
              setSelectObjectType={setSelectObjectType}
              />
          </div>
          <div className="w-2/6 h-full flex flex-col bg-white">
            <h2 className="text-1xl border-2 border-black">処理</h2>
            <GameEditProcess
              engine={engine}
              stageId={id}
              gameData={gameData}
              />
          </div>
        </div>
      </div>
    </div>
  )
}
