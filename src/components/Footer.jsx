import { Link } from "react-router-dom";
import { RoutePath } from "utils/RouteSetting";

export const Footer = () => {
  return (
    <footer className="sm:relative sm:flex sm:justify-between sm:items-center p-2.5 bg-green-400">
      <div className="text-end sm:text-start sm:flex sm:ml-10 list-none">
        <div className="mx-1 inline-block sm:block"><Link to={RoutePath.termsOfService.path}>{RoutePath.termsOfService.name}</Link></div>
        <div className="mx-1 inline-block sm:block"><Link to={RoutePath.privacyPolicy.path}>{RoutePath.privacyPolicy.name}</Link></div>
        <div className="mx-1 inline-block sm:block">©Pythagora maker</div>
      </div>
      <p className="text-base text-black mb-2 mx-4 hidden sm:block">
        ※本ゲームはPC専用となっております。
      </p>
    </footer>
  )
}
