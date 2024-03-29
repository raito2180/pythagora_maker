import { Game } from "components/Game";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { State } from "utils/GameSetting";
import { getStageById, updateStage } from "services/supabaseStages";
import { getUserByAuthId } from "services/supabaseUsers";
import Loading from "components/Loading";

// TODO : GamePlayと処理がほとんど同じなのでコンポーネント化できるか…？
export const TestPlay = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isUserPlacement, setIsUserPlacement] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const onClickPlay = useRef();
  const onClickStageReset = useRef();
  const onClickPlacementReset = useRef();
  const [gameData, setGameData] = useState(null);
  const [countTime, setCountTime] = useState(0);
  const [countIntervalId, setCountIntervalId] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [countDown, setCountDown] = useState(3); // カウントダウン用のステート
  const [showCountDown, setShowCountDown] = useState(false); // カウントダウン表示用のステート

  const fetchData = useCallback(async () => {
    try {
      // ローカルストレージからユーザーIDを取得
      const user_id = localStorage.getItem("_pythagora_maker_session");
      if (!user_id) {
        throw new Error("404");
      }

      const { result, data } = await getStageById(id);
      if (result === "error") {
        throw new Error("505");
      }

      const { result: userResult, data: userData } = await getUserByAuthId(user_id);
      if (userResult === "error") {
        throw new Error("505");
      }

      if (data.profile_id !== userData.id) {
        throw new Error("404");
      }

      setGameData(data);
    } catch (error) {
      if (error.message.includes("404")) {
        alert("存在しないページです");
        window.close();
        return;
      } else if (error.message.includes("505")) {
        alert("エラーが発生しました");
        //window.close();
        return;
      }
    }
  }, [id]);

  // ページ読み込み時にデータを取得
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (gameData) {
      setLoading(false);
      setIsUserPlacement(gameData.content.UserPlacement?.length > 0);
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

  const transformTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // ミリ秒までやると再レンダリングの負荷がかかりそうなので秒まで
    return `${twoDigits(minutes)}:${twoDigits(seconds)}`;
  };

  // ゲームクリア時の処理
  // 先に宣言しないとuseEffect内で使えない
  const gameCompleted = useCallback(() => {
    clearInterval(countIntervalId);
  }, [countIntervalId]);

  // gameCompletedはuseCallbackで囲っているので、変更がなければ再生成されない
  useEffect(() => {
    if (isGameCompleted) {
      gameCompleted();
    }
  }, [isGameCompleted, gameCompleted]);

  // 2桁表示
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

  // リセットボタンの処理
  const handlePlacementReset = useCallback(() => {
    if (!onClickPlacementReset.current) return;
    onClickPlacementReset.current();
  }, [onClickPlacementReset]);

  // ステージリセットボタンの処理
  const handleStageReset = useCallback(() => {
    if (!onClickStageReset.current) return;
    onClickStageReset.current();
  }, [onClickStageReset]);

  // 再生ボタンの処理
  const handleClickPlay = useCallback(() => {
    if (!onClickPlay.current) return;
    onClickPlay.current();
  }, [onClickPlay]);

  // 公開ボタン
  const handleRelease = async () => {
    const response = await updateStage(id, { state: State.release });
    if (response.result === "error") {
      // TODO : エラー処理
      return;
    }
    alert("公開しました");
    window.close();
  }

  // 公開してXにシェア
  const handleReleaseShare = async () => {
    await handleRelease();

    const post = {
      title: "ピタゴラメーカー",
      url: "https://pythagora-maker.vercel.app/game",
    };

    const tweetText = `【${post.title}】ステージ「${gameData.title}」を作成しました！！ぜひ遊んでね！`;
    const twitterUrl = `https://twitter.com/share?url=${encodeURIComponent(
      post.url
    )}&text=${encodeURIComponent(tweetText)}`;

    // 新しいタブでTwitter共有ページを開く
    window.open(twitterUrl, "_blank");
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className={`w-[1200px] m-auto`}>
          <div className="w-full m-auto mt-14 flex flex-col font-[DotGothic16] ">
            <div className="w-full flex">
              <div className="w-1/4 grid grid-flow-col items-center text-start">
                <button
                  className={`hover:text-slate-500 text-slate-950 ${countDown > 0
                    ? "hover:bg-gray-900 bg-gray-600"
                    : "hover:bg-blue-200 bg-blue-400"
                    } transition-all py-2 px-4 my-2`}
                  onClick={handlePlacementReset}
                  aria-label="ユーザーは位置オブジェクトのリセット"
                  disabled={countDown > 0}
                >
                  Reset
                </button>
                <h3 className="text-xl mx-auto">Placement</h3>
              </div>
              <div className="w-3/4 flex flex-col">
                <div className="flex justify-between items-center mx-5">
                  <div className="flex gap-2">
                    <button
                      className={`hover:text-slate-500 text-slate-950 ${countDown > 0
                        ? "hover:bg-gray-900 bg-gray-600"
                        : "hover:bg-blue-200 bg-blue-400"
                        } transition-all py-2 px-4 my-2`}
                      onClick={handleStageReset}
                      aria-label="ステージをリセット"
                      disabled={countDown > 0}
                    >
                      StageReset
                    </button>
                    <button
                      className={`hover:text-slate-500 text-slate-950 ${countDown > 0
                        ? "hover:bg-gray-900 bg-gray-600"
                        : "hover:bg-blue-200 bg-blue-400"
                        } transition-all py-2 px-4 my-2`}
                      onClick={() => window.location.reload()}
                      aria-label="データを再読み込み"
                      disabled={countDown > 0}
                    >
                      再読み込み
                    </button>
                    <button
                      className={`hover:text-slate-500 text-slate-950 ${countDown > 0
                        ? "hover:bg-gray-900 bg-gray-600"
                        : "hover:bg-blue-200 bg-blue-400"
                        } transition-all py-2 px-4 my-2`}
                      onClick={() => window.close()}
                      aria-label="編集に戻る"
                      disabled={countDown > 0}
                    >
                      編集に戻る
                    </button>
                  </div>
                  <h3 className="text-2xl">{gameData.title}</h3>
                  <p>{transformTime(countTime)}</p>
                  <button
                    className={`hover:text-slate-500 text-slate-950 ${countDown > 0
                      ? "hover:bg-gray-900 bg-gray-600"
                      : "hover:bg-red-200 bg-red-400"
                      } transition-all py-2 px-4 my-2`}
                    onClick={handleClickPlay}
                    aria-label="再生"
                    disabled={countDown > 0}
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
              onClickStageReset={onClickStageReset}
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
              <section className="fixed left-0 top-[48px] z-10 w-full h-full flex justify-center items-center bg-black bg-opacity-40">
                <div className="bg-white w-full max-w-[350px] h-full max-h-[400px] p-4 rounded mb-64 flex flex-col justify-center items-center shadow-lg">
                  <h2 className="text-center text-2xl font-semibold">テストクリア！</h2>
                  <div className="text-center my-6 flex flex-col gap-3 w-4/5">
                    {isUserPlacement && (
                      <>
                        <button type="button" className="bg-yellow-200 p-2 hover:bg-yellow-400 transition-all" onClick={handleRelease}>公開する</button>
                        <button type="button" className="bg-yellow-200 p-2 hover:bg-yellow-400 transition-all" onClick={handleReleaseShare}>公開してXにシェア</button>
                        <button type="button" className="bg-yellow-200 p-2 hover:bg-yellow-400 transition-all" onClick={() => {
                          window.location.reload();
                        }}>再テスト</button>
                      </>
                    )}
                    <button type="button" className="bg-yellow-200 p-2 hover:bg-yellow-400 transition-all" onClick={() => {
                      window.close()
                    }}>編集に戻る</button>
                    {!isUserPlacement && <p>※ユーザーが動かせるオブジェクトが1つ以上無いと公開できません</p>}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
};
