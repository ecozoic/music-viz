import { useState } from 'react';

import { getRefreshToken } from './auth/accessToken';
import SpotifyClient from './api/client';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { logout, requestUserAuthorization } from './features/auth/authSlice';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {!isAuthenticated && (
          <button
            onClick={() => {
              dispatch(requestUserAuthorization());
            }}
          >
            Login with Spotify
          </button>
        )}
        {isAuthenticated && (
          <button
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
          </button>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        {isAuthenticated && (
          <>
            <button
              onClick={() => {
                const request = async () => {
                  await getRefreshToken();
                };

                request();
              }}
            >
              Request Refresh Token
            </button>
            <button
              onClick={() => {
                const request = async () => {
                  const client = new SpotifyClient();
                  await client.me();
                };

                request();
              }}
            >
              Request Profile
            </button>
          </>
        )}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
