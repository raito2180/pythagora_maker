import React, { useState, useEffect } from 'react';
import { STAGE_PER_PAGE } from 'utils/Paginate';
import { Link } from 'react-router-dom';
import { RoutePath } from 'utils/RouteSetting';

const HelpCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [stages, setStages] = useState([]);
  const [totalStages, setTotalStages] = useState(0);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <article className='relative bg-yellow-300 p-4 rounded-b-md'>
      {/* 1つのステージを表示する要素 */}
      <section className="grid grid-cols-2 gap-4">
        {stages.map(({ help }) => (
          <div key={help} className="relative flex m-2 p-6 border border-gray-300 shadow-lg rounded-md bg-white hover:translate-y-2 hover:shadow-none transition-all">
            <img src={`/assets/imgs/defaultstage/${help}.png`} />
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

export default HelpCard;