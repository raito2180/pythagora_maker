import { RoutePath } from "utils/RouteSetting";
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import React, { useState,useEffect } from 'react';
import { State } from "utils/GameSetting";
import supabase from "services/supabaseClient";
import { useAuth } from "contexts/AuthContext";
import { FiRefreshCw } from "react-icons/fi";
import { FiPlusSquare } from "react-icons/fi";
import { BiChevronsDown } from "react-icons/bi";
import { RiArrowGoBackFill } from "react-icons/ri";
import notSet from "../../assets/imgs/notSet/NotSet.png";

  const UserStageList = () => {
    const [stages, setStages] = useState([]);
    const { user } = useAuth();
    const [profileId, setProfileId] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [disableClick, setDisableClick] = useState(false);
    const [newData, setNewData] = useState('');

    useEffect(() => {
      if (!user) return; 
        {
        const fetchProfileID = async () => {
          const { data, error } = await supabase.from("profiles").select("id").eq("user_id", user.id).single();
          if (error || !data) {
            console.error("プロフィール情報の取得に失敗しました", error);
            return;
          }
          setProfileId(data.id);
        };
      fetchProfileID();
    }}, [user]);

    
      const fetchStagesData = async () => {
        if (!profileId) return;
        try {
          const { data, error } = await supabase
          .from('stages')
          .select(`*`)
          .eq("profile_id", profileId )
          .order('id');
          if (error) {
            throw error;
          }
          if (data) {
            const stageArray = data.map(stage => ({
              id: stage.id,
              title: stage.title,
              image: stage.image,
              state: stage.state
            }
            ));
            setStages(stageArray);
          }
        } catch (error) {
          if (error.message.includes("404")) {
          // TODO : 404ページに遷移？
          alert("存在しないページです");
          return;
        }
        // TODO : それ以外のエラー。モーダルなどで対処したいetching stages:', error.message);
        }
      };

    useEffect(() => {
      fetchStagesData();
    },[profileId]); //TODO 削除時にも再マウントされるように変更する

    const stateCheck = (stage) =>{
      if(stage.state === State.untested){
       return true;
      }else{
       return false;
      }
    }

    useEffect(() => {
      if (updating) {
        setDisableClick(true); // ボタンを無効化する
        const timeoutId = setTimeout(() => {
          setDisableClick(false); // 2秒後にボタンを有効化する
          setUpdating(false); // updatingをfalseに戻す
        }, 2000);

        return () => {
        if(timeoutId) { clearTimeout(timeoutId) }
        }; //setTimeoutのクリーンアップ
      }
    }, [updating]);

    const handleToggleStage = async (index) => {
      const updatedStages =  [...stages]
      updatedStages[index].state = updatedStages[index].state === State.release ? State.private : State.release;
      setUpdating(true);

      const updatedStagesMapped = updatedStages.map((stage, i) => {
        if (i !== index ) {
          return {
          ...stage,
          state: stage.state === State.release?  State.private : stage.state
        };
        }
        return stage;
      });
      try {
        const stateChangedArray = [];
        for (const stage of updatedStagesMapped) {
          const { data, error } = await supabase
            .from('stages')
            .update({ state: stage.state })
            .eq('id', stage.id)
            .select('*');
          if (error) {
            throw error;
          }
          if (data) {
            stateChangedArray.push(data);
          }        
        }
        setStages(stateChangedArray.flat());
        console.log('配列', stateChangedArray);
      }
        catch (error) {
        alert("エラーが発生しました: " + error.message);
        }
      };

      const handleDeleteStage = async (index) => {
        const confirmDelete = window.confirm('本当にこのステージを削除しますか？');
        if (confirmDelete) { // ユーザーが確認した場合の処理
        const deleteArray = stages.filter((_, i) => i !== index);
        try {
            
            const { error } = await supabase
              .from('stages')
              .delete()
              .eq('id', stages[index].id)
              if (error) {
                console.error('データの削除に失敗しました:', error.message);
              } else {
                console.log('データの削除が成功しました');
                setStages(deleteArray);
              }
            } catch (error) {
              console.error('エラーが発生しました:', error.message);
            }
      };}

    const handleSubmit = async (event) => {
      event.preventDefault(); // フォームのデフォルトの動作を無効にする(処理にReactを適用する)
      if (stages.length >= 3) return;
      const { data, error } = await supabase
      .from('stages')
      .insert([{
        title: newData,
        profile_id: profileId   
      }]
      );
      if (error) {
        console.error('データの挿入に失敗しました:', error.message);
      } else {
        console.log('データの挿入が成功しました:', newData);
      }
      console.log('フォームが送信されました:', newData);
      fetchStagesData();
      setNewData('');
    };

    function cursor(stage) {
      return stage.state === State.untested ? "cursor-no-drop" : ""; // 真の場合は "cursor-no-drop" を返し、偽の場合は空文字列を返す
    }    

    const handleInputValue = async (event) => {
      const newValue = event.target.value;
        setNewData(newValue); // 入力されたテキストデータを取得してnewDataステートにセットする
    };

    function stagesMax() {
      if (stages.length < 3) {
        return (
          <>
            <div>
              <h1 className="font-bold text-4xl mb-4 items-center justify-center flex"><BiChevronsDown />Stage作成</h1>
            </div>
            <form className="items-center justify-center flex font-bold text-xl" onSubmit={handleSubmit}>
            <h1 className="mr-1">タイトル:</h1>
            <input className="mr-1"
              type="text"
              value={newData}
              onChange={handleInputValue}
              placeholder="タイトルを入力"
              name="title" // input要素にname属性を追加して送信するデータのキーを設定する
              required
            />
            <div className="items-center justify-center flex">
            <button>
              <FiPlusSquare size={40} />
            </button>
            </div>
            </form>
          </>
        );
      } else {
        return null; // 何も表示しない場合
      }
    };

    return (
      <ul>
      {stages && stages.map((stage, index) => (
      <li className="flex my-7 items-center justify-center" key={stage.id}>
        <div className="bg-orange-300 flex border border-black rounded-lg  translate-y-3 hover:translate-y-[-5] transition-all">
        <div>
          <h1 className="font-bold text-2xl py-4 px-8 w-[200px] truncate">
            {stage.title}          
          </h1>
        <div>
          <h1 className="font-bold text-2xl py-4 px-8">
            <span className={`bg-blue-500 text-yellow-200 flex rounded-lg justify-center`}>
              <button className={`${cursor(stage)}`}
                      onClick={() => handleToggleStage(index)} 
                      disabled={stateCheck(stage) || disableClick}>
                {updating ? (<span className='flex justify-center font-[Raleway]'>更新中<FiRefreshCw className="animate-spin" /></span>
                ) : (
                  stage.state === State.release ? "公開" : stage.state === State.private ? "非公開" : "未テスト")}
              </button>
            </span>
          </h1>
          </div>
        </div>
          <div className="flex-col">
            <div className="pt-4 px-8">
              <Link to={RoutePath.gameEdit.path(stage.id)}>
                <FiEdit2 size={40}/>
              </Link>
            </div>
            <div className="pt-4 px-8">
              <button onClick={() => handleDeleteStage(index)}>              
                <FiTrash2 size={40}/>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <h1 className="font-bold text-2xl px-8">
              <img src={notSet} alt="NotSet" style={{ width: "150px", height: "100px" }} />     {/* TODO:画像処理*/}
            </h1>
          </div>
        </div>
      </li>
      ))}
      {stagesMax()}
      </ul>
    );
  };

export const GameProduction = () => {
  
    return (
      <div className="w-full relative font-[DotGothic16] mt-14 ">
        <div>
            <Link to={RoutePath.stageSelect.path}>
              <h1 className="font-bold text-4xl items-center justify-center flex mb-7">{RoutePath.stageSelect.name}へ
                <RiArrowGoBackFill />
              </h1>  
            </Link>
        </div>
        <div>
          <h1 className="font-bold text-4xl items-center justify-center flex">
            Edit
          </h1>
          <UserStageList />
        </div>
      </div>
  )
}
