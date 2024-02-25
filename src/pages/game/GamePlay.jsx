import { Game } from 'components/Game';
import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import { State } from 'utils/GameSetting';
import { getStageById } from 'services/supabaseStages';

export const GamePlay = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [gameClear, setGameClear] = useState(false);
  const onClickPlay = useRef();
  const onClickBallReset = useRef();
  const onClickPlacementReset = useRef();
  const [gameData, setGameData] = useState(null);
  const countStartTime = useRef(0);
  // ゲームスタート演出の遅延時間
  const GAME_START_DELAY = 300;
  // ミリ秒から秒に変換
  const SECONDS_TO_MILLISECONDS = 1000;
  // 秒から分に変換
  const MINUTES_TO_SECONDS = 60;
  // ミリ秒から分に変換
  const MILLISECONDS_TO_MINUTES = MINUTES_TO_SECONDS * SECONDS_TO_MILLISECONDS;
  // ミリ秒の切り捨て値
  const MILLISECONDS_FLOOR_VALUE = 10;

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
      }
      // TODO : それ以外のエラー。モーダルなどで対処したい
    };
  }, [id]);

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
    // NOTE : ローディング終了直後だとレンダリングがされてないのでちょっと待つ
    const setTimeoutId = setTimeout(() => {
      // ゲームスタート演出
      gameStart();
    }, GAME_START_DELAY);

    return () => {
      clearTimeout(setTimeoutId);
    }
  }, [loading]);

  useEffect(() => {
    if (gameClear) {
      // NOTE : 2038年問題がありますが短期間の公開と見ているので問題ないと判断
      const countEndTime = Date.now();
      // ミリ秒取得
      const countTime = (countEndTime - countStartTime.current);
      console.log(countTime);
      // ミリ秒を分に変換
      const minutes = twoDigits(Math.floor(countTime / MILLISECONDS_TO_MINUTES));
      const minutesText = minutes > 0 ? `${minutes}m` : "";
      // ミリ秒を秒に変換
      const seconds = twoDigits(Math.floor(countTime / SECONDS_TO_MILLISECONDS));
      // ミリ秒から分と秒をひいてミリ秒に変換
      const secondsText = seconds > 0 ? `${seconds}s` : "";
      // ミリ秒 = 総ミリ秒 - (分からミリ秒に変換した値) - (秒からミリ秒に変換した値)
      let milliSeconds = countTime - (minutes * MILLISECONDS_TO_MINUTES) - (seconds * SECONDS_TO_MILLISECONDS);
      // ミリ秒は3桁になるので、10で割ったあとに小数点以下を切り捨てると2桁になる
      milliSeconds = Math.floor(milliSeconds / MILLISECONDS_FLOOR_VALUE);
      // 必ず2桁表記にする
      milliSeconds = twoDigits(milliSeconds);
      const milliSecondsText = milliSeconds > 0 ? `${milliSeconds}ms` : "";
      const time = `${minutesText}${secondsText}${milliSecondsText}`;
      alert(`ゲームクリア！\nクリアタイム ${time}`);
      // TODO : クリア後の演出が終わったらステージ選択画面に遷移
    }
  }, [gameClear]);

  // 2桁表示
  const twoDigits = (num) => {
    return ("00" + num).slice(-2);
  }

  const gameStart = () => {
    // TODO : ゲームスタート演出
    alert("ゲームスタート");
    countStartTime.current = Date.now();
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
      {loading ? <div>loading...</div> :
        <div className={`w-[1200px] m-auto`}>
          <div className="w-full m-auto mt-14 flex flex-col font-[DotGothic16] ">
            <div className='w-full flex'>
              <div className='w-1/4 grid grid-flow-col items-center text-start'>
                <button className='hover:bg-blue-200 bg-blue-400 hover:text-slate-500 text-slate-950 transition-all py-2' onClick={handlePlacementReset} aria-label="ユーザーは位置オブジェクトのリセット">Reset</button>
                <h3 className='text-xl mx-auto'>Placement</h3>
              </div>
              <div className='w-3/4 flex flex-col'>
                <div className='flex justify-between items-center mx-5'>
                  <button className='hover:bg-blue-200 bg-blue-400 hover:text-slate-500 text-slate-950 transition-all py-2 px-4 my-2' onClick={handleBallReset} aria-label="ボールの位置をリセット">BallReset</button>
                  <h3 className='text-2xl'>{gameData.title}</h3>
                  <button className='hover:text-slate-500 text-slate-950 hover:bg-red-200 bg-red-400 transition-all py-2 px-4 my-2' onClick={handleClickPlay} aria-label="再生">▶</button>
                </div>
              </div>
            </div>
            <Game
              stageData={gameData.content}
              setOnClickPlay={onClickPlay}
              setOnClickPlacementReset={onClickPlacementReset}
              setOnClickBallReset={onClickBallReset}
              setGameClear={setGameClear} />
          </div>
        </div>
      }
    </>
  )
}