import React, { useEffect, useState } from 'react';
import './App.scss';
import { Header, MaxHeightContainer } from './components';
import {Routes, Route, Navigate} from 'react-router-dom'
import { DashboardRoute, SetlistRoute, SongsRoute } from 'routes';

function App() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = width < 650

  return (
    <div className="App">
      <MaxHeightContainer
        fullHeight
        header={<Header isMobile={isMobile} />}
      >
        <Routes>
          <Route path="/" element={<Navigate replace to="/setlists" />} />
          <Route path="/setlists" element={<DashboardRoute />} />
          <Route path="/songs" element={<SongsRoute />} />
          <Route path="/setlists/new-setlist" element={<SetlistRoute isMobile={isMobile} />} />
          <Route path="/setlists/:name" element={<SetlistRoute isMobile={isMobile} />} />
        </Routes>
      </MaxHeightContainer>
    </div>
  );
}

export default App;
