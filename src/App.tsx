import React from 'react';
import './App.css';
import AuthContextProvider from './components/Auth-Context-Provider/AuthContextProvider.tsx';
import { BrowserRouter as Router } from "react-router-dom";
import RoutePaths from './components/RoutePaths/RoutePaths.tsx';
import ResponsiveAppBar from './components/AppBar/AppBar.tsx';
import StickyFooter from './views/Footer/Footer.tsx';
import AddonsContextProvider from './components/AddonsContextProvider/AddonsContextProvider.tsx';
import { ScrollToTop } from './views/ScrollToTop/ScrollToTop.tsx';
import InfoLine from './views/InfoLine/InfoLine.tsx';


const App: React.FC = () => {

  return (
    <>
      <Router>
        <ScrollToTop />
        <AddonsContextProvider>
          <AuthContextProvider>
            <InfoLine />
            <ResponsiveAppBar />
            <RoutePaths />
            <StickyFooter />
          </AuthContextProvider >
        </AddonsContextProvider>
      </Router>
    </>
  );
};

export default App;