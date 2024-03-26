import React, { useState } from 'react';

const helpStages = [
  { help: 'help1', imagePath: '/assets/imgs/help/help1.png' },
  { help: 'help2', imagePath: '/assets/imgs/help/help2.png' },
  { help: 'help3', imagePath: '/assets/imgs/help/help3.png' },
  { help: 'help4', imagePath: '/assets/imgs/help/help4.png' },
  { help: 'help5', imagePath: '/assets/imgs/help/help5.png' },
  { help: 'help6', imagePath: '/assets/imgs/help/help6.png' },
  { help: 'help7', imagePath: '/assets/imgs/help/help7.png' },
  { help: 'help8', imagePath: '/assets/imgs/help/help8.png' },
  { help: 'help9', imagePath: '/assets/imgs/help/help9.png' },
  // { help: 'help10', imagePath: '/assets/imgs/help/help10.png' },
];

const STAGE_PER_PAGE = 1;

const HelpCard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(helpStages.length / STAGE_PER_PAGE);

  const currentStages = (() => {
    const startPage = (currentPage - 1) * STAGE_PER_PAGE;
    const endPage = startPage + STAGE_PER_PAGE;
    return helpStages.slice(startPage, endPage);
  })();

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <article className="relative bg-pink-300 p-4 rounded-b-md mt-28 mx-auto max-w-7xl">
      {/* 1つのステージを表示する要素 */}
      <section className="flex justify-center">
        {currentStages.map(({ help, imagePath }, index) => (
          <div key={index} className="relative flex m-1 p-6 border border-gray-300 shadow-lg rounded-md bg-white hover:translate-y-2 hover:shadow-none transition-all">
            <div>
              <img src={imagePath} alt={`Help ${help}` }/>
            </div>
          </div>
        ))}
      </section>
      {/* ページネーションのボタン部分 */}
      <section className="flex justify-center mt-8">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
          className="bg-green-300 text-black px-4 py-2 rounded-l hover:bg-green-500 cursor-pointer border-lime-500 border transition-all">前のページへ</button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
          className="bg-green-300 text-black px-4 py-2 rounded-r hover:bg-green-500 cursor-pointer border-lime-500 border transition-all">次のページへ</button>
      </section>
    </article>
  );
};

export default HelpCard;
