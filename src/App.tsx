import React, { useEffect, useState } from 'react';
import './App.scss';
import { Header, LoginForm, MaxHeightContainer } from 'components';
import {Routes, Route, Navigate} from 'react-router-dom'
import { DashboardRoute, NewSetlistRoute, SetlistRoute, SongsRoute } from 'routes';
import { useIdentityContext } from 'react-netlify-identity';

const ProtectedRoute = ({children}: {children: JSX.Element}) => {
  const { isLoggedIn } = useIdentityContext()
  return (isLoggedIn || !!process.env.REACT_APP_IS_DEV) ? children : <LoginForm />
}


function App() {
  const [width, setWidth] = useState(0)
  const { isLoggedIn } = useIdentityContext()

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
        header={(isLoggedIn || !!process.env.REACT_APP_IS_DEV) && <Header isMobile={isMobile} />}
      >
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate replace to="/setlists" />
            </ProtectedRoute>
          } />
          <Route path="/setlists" element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          } />
          <Route path="/songs" element={
            <ProtectedRoute>
              <SongsRoute />
            </ProtectedRoute>
          } />
          <Route path="/setlists/new-setlist" element={
            <ProtectedRoute>
              <NewSetlistRoute isMobile={isMobile} />
            </ProtectedRoute>
          } />
          <Route path="/setlists/:id" element={
            <ProtectedRoute>
              <SetlistRoute isMobile={isMobile} />
            </ProtectedRoute>
          } />
        </Routes>
      </MaxHeightContainer>
    </div>
  );
}

export default App;

// TODO optimistic updates across the app
// TODO Song Display long name overflow
// TODO Song display preview for dashboard page