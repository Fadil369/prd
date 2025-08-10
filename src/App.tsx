import React from "react";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import { AppProvider } from "./context/AppContext";

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main id="main-content">
          <LandingPage />
        </main>
      </div>
    </AppProvider>
  );
};

export default App;
