import { useDevice } from 'hooks/useDevice';
import MobileHomePage from 'pages/MobileHomePage';
import { Routes, Route } from "react-router-dom";
import { RouteSetting } from "utils/RouteSetting";

export const RoutesComponent = () => {
  const { isPC, isMobile } = useDevice();

  if (isPC === null && isMobile === null) {
    return;
  }

  return (
    <Routes>
      {isPC && !isMobile &&
        RouteSetting.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={route.component}
            />)
        })}
      {
        isMobile && !isPC &&
        <Route path="/" element={<MobileHomePage />} />
      }

    </Routes>
  )
}
