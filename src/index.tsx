import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SongsContextProvider } from 'context';
import {BrowserRouter} from 'react-router-dom'
import { SetlistContextProvider } from 'context/SetlistContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { IdentityContextProvider } from "react-netlify-identity"

const queryClient = new QueryClient()

const url = 'https://fascinating-stardust-420d3e.netlify.app/'

ReactDOM.render(
  <React.StrictMode>  
    <IdentityContextProvider url={url}>
      <QueryClientProvider client={queryClient}>
        <SongsContextProvider>
          <SetlistContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SetlistContextProvider>
        </SongsContextProvider>
      </QueryClientProvider>
    </IdentityContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
