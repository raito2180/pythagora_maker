import { Game } from "components/Game";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { State } from "utils/GameSetting";
import { getStageById } from "services/supabaseStages";
import ConfettiComponent from "components/Confetti";

export const GamePlay = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const onClickPlay = useRef();
  const onClickBallReset = useRef();
  const onClickPlacementReset = useRef();
  const [gameData, setGameData] = useState(null);
  const [countTime, setCountTime] = useState(0);
  const [countIntervalId, setCountIntervalId] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [countDown, setCountDown] = useState(3); // カウントダウン用のステート
  const [showCountDown, setShowCountDown] = useState(false); // カウントダウン表示用のステート

  const fetchData = useCallback(async () => {
    try {
      let { result, data } = await getStageById(id);
      if (result === "error") {
        throw new Error("505");
      }

      if (data.state !== State.release) {
        throw new Error("404");
      }

      setGameData(data);
    } catch (error) {
      if (error.message.includes("404")) {
        // TODO : 404ページに遷移？
        alert("存在しないページです");
        return;
        // TODO : それ以外のエラー。モーダルなどで対処したい
      }
    }
  }, [id]);

  // ページ読み込み時にデータを取得
  // 取得したデータの変更があるたびに走るが、fetchDataはuseCallBackで囲っているので変更がなければ再生成されない
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (gameData) {
      setLoading(false);
    }
  }, [gameData]);

  useEffect(() => {
    if (loading) return;

    setShowCountDown(true);
    // カウントダウンを3から開始する
    setCountDown(3);
    const countDownInterval = setInterval(() => {
      setCountDown((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(countDownInterval);
  }, [loading]);

  useEffect(() => {
    if (countDown < 0) {
      // カウントダウンが終了したら表示をクリア
      setShowCountDown(false);
      // カウントダウンが終了したらゲーム開始の処理を実行
      if (!isGameStarted) {
        gameStart();
      }
    }
  }, [countDown, isGameStarted]);

  // ミリ秒までやると再レンダリングの負荷がかかりそうなので、秒までにしています
  const transformTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${twoDigits(minutes)}:${twoDigits(seconds)}`;
  };

  // ゲームクリア時の処理
  // 先に宣言しないとuseEffect内で使えない
  const gameCompleted = useCallback(() => {
    clearInterval(countIntervalId);
  }, [countIntervalId]);

  useEffect(() => {
    if (isGameCompleted) {
      gameCompleted();
    }
  }, [isGameCompleted, gameCompleted]);

  const twoDigits = (num) => {
    return ("00" + num).slice(-2);
  };

  const gameStart = () => {
    setIsGameStarted(true);
    // ゲームの時間計測を開始
    setCountTime(0); // ゲーム開始時に時間を0にリセット
    const intervalId = setInterval(() => {
      setCountTime((prev) => prev + 1);
    }, 1000);
    setCountIntervalId(intervalId);
  };

  const handlePlacementReset = useCallback(() => {
    onClickPlacementReset.current();
  }, [onClickPlacementReset]);

  const handleBallReset = useCallback(() => {
    onClickBallReset.current();
  }, [onClickBallReset]);

  const handleClickPlay = useCallback(() => {
    onClickPlay.current();
  }, [onClickPlay]);

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className={`w-[1200px] m-auto`}>
          <div className="w-full m-auto mt-14 flex flex-col font-[DotGothic16] ">
            <div className="w-full flex">
              <div className="w-1/4 grid grid-flow-col items-center text-start">
                <button
                  className="hover:bg-blue-200 bg-blue-400 hover:text-slate-500 text-slate-950 transition-all py-2"
                  onClick={handlePlacementReset}
                  aria-label="ユーザーは位置オブジェクトのリセット"
                >
                  Reset
                </button>
                <h3 className="text-xl mx-auto">Placement</h3>
              </div>
              <div className="w-3/4 flex flex-col">
                <div className="flex justify-between items-center mx-5">
                  <button
                    className="hover:bg-blue-200 bg-blue-400 hover:text-slate-500 text-slate-950 transition-all py-2 px-4 my-2"
                    onClick={handleBallReset}
                    aria-label="ボールの位置をリセット"
                  >
                    BallReset
                  </button>
                  <h3 className="text-2xl">{gameData.title}</h3>
                  <p>{transformTime(countTime)}</p>
                  <button
                    className={`hover:text-slate-500 text-slate-950 ${
                      countDown > 0
                        ? "hover:bg-gray-900 bg-gray-600"
                        : "hover:bg-red-200 bg-red-400"
                    } transition-all py-2 px-4 my-2`}
                    onClick={handleClickPlay}
                    aria-label="再生"
                    disabled={countDown > 0} // カウントダウンが0より大きい間はボタンを無効にする
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
            <Game
              stageData={gameData.content}
              setOnClickPlay={onClickPlay}
              setOnClickPlacementReset={onClickPlacementReset}
              setOnClickBallReset={onClickBallReset}
              setIsGameCompleted={setIsGameCompleted}
              stageId={id}
            />
            {showCountDown && (
              <div className="fixed text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-black text-shadow-md z-50">
                <h2 className="text-6xl text-black font-bold">
                  {countDown > 0 ? countDown : "ゲームスタート！"}
                </h2>
              </div>
            )}
            {isGameCompleted && (
              <ConfettiComponent clearTime={transformTime(countTime)} />
            )}
          </div>
        </div>
      )}
    </>
  );
};
