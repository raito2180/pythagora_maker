import { RoutesComponent } from "components/RoutesComponent";
import "./App.css";
import Header from "components/Header";
import { Footer } from "components/Footer";
import { useDevice } from "hooks/useDevice";
import { usePageTracking } from "utils/useTracking";
import { Suspense } from "react";
import Loading from "components/Loading";

function App() {
  const { isPC, isMobile } = useDevice();
  usePageTracking();
  if (isPC === null && isMobile === null) {
    return;
  }

  return (
    <div className="flex flex-col w-full h-screen">
      {isPC && !isMobile &&
        <header className="fixed top-0 h-14 w-full z-10">
          <Header />
        </header>
      }
      <main className="flex-1 bg-green-400">
        <RoutesComponent />
      </main>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
