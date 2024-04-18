import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  logout,
  requestUserAuthorization,
  refreshToken,
} from './features/auth/authSlice';
import useSpotifyClient from './hooks/useSpotifyClient';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { PATHS } from './routes/constants';

function App() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const client = useSpotifyClient();

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
        {isAuthenticated && (
          <>
            <button
              onClick={() => {
                dispatch(refreshToken());
              }}
            >
              Request Refresh Token
            </button>
            <button
              onClick={() => {
                client.me();
              }}
            >
              Request Profile
            </button>
          </>
        )}
        <>
          <div>
            <Link
              to={PATHS.ARTIST.replace(':artistID', '3jOstUTkEu2JkjvRdBA5Gu')}
            >
              Weezer
            </Link>
          </div>
        </>
      </div>
    </>
  );
}

export default App;
