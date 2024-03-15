export const PhysicalSettings = () => {
  return (
    <div className="h-full flex flex-col border-b-2 border-r-2 border-l-2 border-black">
      <div className="w-full h-1/2 flex">
        <div className="w-1/5 h-full flex flex-col items-center">
          <label>幅</label>
          <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div className="w-1/5 h-full flex flex-col items-center">
          <label>高さ</label>
          <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div className="w-1/5 h-full flex flex-col items-center">
          <label>X座標</label>
          <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div className="w-1/5 h-full flex flex-col items-center">
          <label>Y座標</label>
          <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div className="w-1/5 h-full flex items-center justify-center">
          <button type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">リセット</button>
        </div>
      </div>
      <div className="w-full h-1/2 flex">
        <div className="w-1/5 h-full">f</div>
        <div className="w-1/5 h-full">g</div>
        <div className="w-1/5 h-full">h</div>
        <div className="w-1/5 h-full">i</div>
        <div className="w-1/5 h-full">j</div>
      </div>
    </div>
  );
}