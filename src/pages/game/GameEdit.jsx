import {
  useEffect,
  useState,
  useRef
} from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Engine, use } from "matter-js"
import { StageEditor } from "components/StageEditor"
import { GameEditProcess } from "components/GameEditProcess"
import { GameEditSettings } from "components/GameEditSettings"
import { RoutePath } from "utils/RouteSetting"
import { State } from "utils/GameSetting"
import { getStageById } from "services/supabaseStages";

export const GameEdit = () => {
  const { id } = useParams();
  const [engine, setEngine] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [selectObjectX, setSelectObjectX] = useState(null);
  const [selectObjectY, setSelectObjectY] = useState(null);
  const [selectObjectType, setSelectObjectType] = useState(null);
  const selectObjectRef = useRef(null);

  useEffect(() => {
    setEngine(Engine.create());
    fetchData();
    return () => {
      engine && Engine.clear(engine);
    };
  }, []);

  const navigate = useNavigate();

  const fetchData = async () => {

    try {
      let { result, data } = await getStageById(id);
      if (result === "error") {
        throw new Error("505");
      }

      if (data.state !== State.untested) {
        throw new Error("404");
      }

      setGameData(data);
    } catch (error) {
      if (error.message.includes("404")) {
        navigate(RoutePath.gameProduction.path);
        return;
      }
    }
  };

  return (
    <>
      {(gameData) && (
        <div className="w-[1280px] h-[740px] m-auto font-[DotGothic16]">
          <div className="w-full m-auto mt-14 flex items-center">
            <h1 className="text-5xl">Edit</h1>
            <Link to={RoutePath.gameProduction.path} className="ml-auto text-2xl">一覧へ戻る</Link>
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
                <h2 className="text-1xl border-2 border-black">
                  オブジェクト設定
                  {selectObjectType === "Rectangle" && (
                    <span> (四角形)</span>
                  )}
                  {selectObjectType === "Circle" && (
                    <span> (円)</span>
                  )}
                  {selectObjectType === "Triangle" && (
                    <span> (三角形)</span>
                  )}
                  {selectObjectType === "Polygon" && (
                    <span> (多角形)</span>
                  )}
                </h2>
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
      )}
    </>
  )
}
