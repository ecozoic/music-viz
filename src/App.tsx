import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import genCodeChallenge from './auth/code-challenge';
import requestUserAuthorization from './auth/user-authorization';
import { getRefreshToken } from './auth/access-token';
import SpotifyClient from './api/client';

function App() {
  const [count, setCount] = useState(0);

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
        <button
          onClick={() => {
            const login = async () => {
              const challenge = await genCodeChallenge();
              requestUserAuthorization(challenge);
            };

            login().catch(console.error);
          }}
        >
          Login with Spotify
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
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
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
