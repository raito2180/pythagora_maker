import React, { useState } from "react";
import { DefaultStageCard } from "components/DefaultStageCard";
import { UsersStageCard } from "components/UsersStageCard";
import { MyIdeaStageCard } from "components/MyIdeaStageCard";

const tabs = ['Default', 'User\'s', 'My idea'];

const tabButtonClasses = {
  'Default': "bg-teal-100",
  'User\'s': "bg-yellow-300",
  'My idea': "bg-red-500"
};

export const StageSelectPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const isMyIdeaTab = activeTab === 'My idea';
  const DISABLE_TAB_STYLE = "translate-y-3 hover:translate-y-[-5] transition-all";

  // タブに応じて背景色を設定
  const getTabButtonClass = (tabName) => {
    return "";
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // それぞれのタブのコンポーネントをレンダリングする
  const renderStageCards = () => {
    switch (activeTab) {
      case "Default":
        return <DefaultStageCard />;
      case 'User\'s':
        return <UsersStageCard />;
      case 'My idea':
        return <MyIdeaStageCard />;
    }
  };

  function handleTabClickEvent(tab) {
    return function () {
      handleTabClick(tab);
    };
  }


  return (
    <div className="w-full max-w-[1280px] m-auto mt-24 flex flex-col">
      <div className="flex justify-between">
        <div className="flex space-x-4 relative">
          {/* ↓ My idea以外のタブボタンをdiv内に表示する */}
          {tabs.slice(0, -1).map(tab => (
            <button
              key={tab}
              onClick={handleTabClickEvent(tab)}
              className={`px-4 py-2 text-3xl font-semibold rounded-md rounded-b-none transition-all ${tabButtonClasses[tab]} ${activeTab === tab ? getTabButtonClass(tab) : DISABLE_TAB_STYLE}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* My ideaボタン */}
        <button
          onClick={handleTabClickEvent('My idea')}
          className={`px-4 py-2 text-3xl font-semibold rounded-md rounded-b-none bg-orange-300 ${isMyIdeaTab ? getTabButtonClass("My idea") : DISABLE_TAB_STYLE}`}
        >
          My Idea
        </button>
      </div>

      <div>
        {renderStageCards()}
      </div>
    </div >
  );
};