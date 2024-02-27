import { RoutePath } from "utils/RouteSetting";
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { HiMiniPlay } from "react-icons/hi2";


const UserStageList = ({ title, openStatus, imageSrc }) => {
  return (
    <li className="flex my-7 items-center justify-center">
      <div className="bg-gray-300 flex">
      <div>
        <h1 className="font-bold text-2xl py-4 px-8 w-[200px] truncate">
          {title}
        </h1>
        <h1 className="font-bold text-2xl py-4 px-8">
          <span className="bg-blue-500 text-yellow-200 flex rounded-lg justify-center">
            {openStatus}
          </span> 
        </h1>
      </div>
        <div className="flex-col">
          <div className="pt-4 px-8">
            <FiEdit2 size={40}/>
          </div>
          <div className="pt-4 px-8">
            <FiTrash2 size={40}/>
          </div>
        </div>
        <div >
          <h1 className="font-bold text-2xl py-12 px-8 text-yellow-200">
            <div className="bg-red-500 flex rounded-lg px-4 py-2">
              <HiMiniPlay />Test
            </div>
          </h1>
        </div>
        <div className="flex-col">
          <h1 className="font-bold text-2xl pt-9 px-8">
            <img src={imageSrc} alt="NotSet" style={{ width: "150px", height: "auto" }} />
          </h1>
        </div>
      </div>
    </li>
  );
}

export const GameProduction = () => {
  const UserStageItems = ({ items }) => {
    return (
      <ul className="flex-col">
        {items.map((item, index) => (
          <UserStageList
            key={index}
            title={item.title}
            openStatus={item.openStatus}
            imageSrc={item.imageSrc}
          />
        ))}
      </ul>
    )
  }
  const items = [
    { title: "aaaaaあああああああああああああああああっ！", openStatus: "Open Now", imageSrc: "/NotSet.png" },  /* TODO:DBが使用できる状態になり次第、DBから引用されるように変更予定 */
    { title: "冬は乾燥の季節", openStatus: "To Open", imageSrc: "/NotSet.png" },
    { title: "春は出会い", openStatus: "To Open", imageSrc: "/NotSet.png" }
  ]

    return (
      <div className="w-full relative font-[DotGothic16] mt-14">
        <Link to={RoutePath.gameMake.path}>
          <h1 className="font-bold text-4xl flex mb-7">{RoutePath.gameMake.name}</h1>
        </Link>
        <div>
          <h1 className="font-bold text-4xl items-center justify-center flex">
            Edit
          </h1>
          <UserStageItems items={items} />
        </div>
      </div>
  )
}
