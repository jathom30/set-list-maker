import React, { useEffect, useState } from 'react';
import './App.scss';
import { Header, MaxHeightContainer } from './components';
import {Routes, Route} from 'react-router-dom'
import { SetlistRoute, SongsRoute } from 'routes';

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
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/songs" element={<SongsRoute />} />
          <Route path="/set-lists" element={<SetlistRoute isMobile={isMobile} />} />
        </Routes>
      </MaxHeightContainer>
    </div>
  );
}

export default App;
