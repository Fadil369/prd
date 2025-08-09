import React from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <LandingPage />
        </main>
      </div>
    </AppProvider>
  );
};

export default App;
