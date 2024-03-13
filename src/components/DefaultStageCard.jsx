import React, { useState, useEffect } from 'react';
import { STAGE_PER_PAGE } from 'utils/Paginate';
import { Link } from 'react-router-dom';
import { RoutePath } from 'utils/RouteSetting';
import { getDefaultStagesRange, getStagesCountByAdmins } from 'services/supabaseStages';
import "./stageCard.css"

export const DefaultStageCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [stages, setStages] = useState([]);
  const [totalStages, setTotalStages] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStagesData = async () => {
      try {
        const startPage = (currentPage - 1) * STAGE_PER_PAGE;
        const response = await getDefaultStagesRange({ start: startPage, end: startPage + STAGE_PER_PAGE - 1 });
        setStages(response.data);
        // エラーハンドリングについては、拡張の余地ありあり
      } catch (error) {
        setError('ステージ情報を取得中にエラーが発生しました。');
        console.error(error);
      }
    };

    fetchStagesData();
  }, [currentPage]);

  useEffect(() => {
    const fetchCountStagesData = async () => {
      try {
        const response = await getStagesCountByAdmins();
        setTotalStages(response.count);
        // エラーハンドリングについては、拡張の余地ありあり
      } catch (error) {
        setError('ステージ情報を取得中にエラーが発生しました。');
        console.error(error);
      }
    };

    fetchCountStagesData();
  }, []);

  // エラーハンドリングについては、拡張の余地ありあり
  if (error) {
    return <div className="error">{error}</div>;
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <article className='relative bg-teal-100 p-4 rounded-b-md'>
      {/* 1つのステージを表示する要素 */}
      <section className="grid grid-cols-2 gap-4">
        {stages.map(({ id, title, image }) => (
          <div key={id} className="relative flex m-2 p-6 border border-gray-300 shadow-lg rounded-md bg-white hover:translate-y-2 hover:shadow-none transition-all">
            <div className='w-2/3'>
              <img src={`/assets/imgs/defaultstage/${image}.png`} alt={title} />
            </div>
            <div className='w-1/3 flex flex-col justify-center items-center gap-10'>
              <h4 className="text-6xl font-bold">{title}</h4>
              <Link
                to={RoutePath.gamePlay.path(id)}
                className=" bg-red-500 text-yellow-300 px-4 py-2 rounded shadow hover:bg-yellow-300 focus:outline-none hover:text-red-500 focus:ring text-4xl transition-all play-link">
                <span className='play-text'>Play</span>
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ページネーションのボタン部分 */}
      <section className="flex justify-center mt-8">
        <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
          className="bg-green-300 text-black px-4 py-2 rounded-l hover:bg-green-500 cursor-pointer border-lime-500 border transition-all">前のページへ</button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage >= Math.ceil(totalStages / STAGE_PER_PAGE)}
            className="bg-green-300 text-black px-4 py-2 rounded-r hover:bg-green-500 cursor-pointer border-lime-500 border transition-all">次のページへ</button>
      </section>
    </article>
  );
};