import { Link } from "react-router-dom";
import { RoutePath } from "utils/RouteSetting";

export const Footer = () => {
  return (
    <footer className="sm:relative sm:flex sm:justify-between sm:items-center p-2.5 bg-green-400">
      <ul className="text-end sm:text-start sm:flex sm:ml-10">
        <li className="mx-1 inline-block sm:block">利用規約</li>
        <li className="mx-1 inline-block sm:block"><Link to={RoutePath.privacy_policy.path}>{RoutePath.privacy_policy.name}</Link></li>
        <li className="mx-1 inline-block sm:block">©Pythagora maker</li>
      </ul>
      <p className="text-base text-black mb-2 mx-4 hidden sm:block">
        ※本ゲームはPC専用となっております。
      </p>
    </footer>
  )
}
