import { useMemo } from 'react';
import { useStore } from 'react-redux';

import { useAppDispatch } from '../app/hooks';
import { refreshToken } from '../features/auth/authSlice';
import SpotifyClient from '../api/client';
import { AppStore } from '../app/store';

function useSpotifyClient() {
  const dispatch = useAppDispatch();
  const store = useStore() as AppStore;

  const client = useMemo(() => {
    return new SpotifyClient(
      () => store.getState().auth.accessToken,
      () => store.getState().auth.expiresIn,
      () => dispatch(refreshToken()),
    );
  }, []);

  return client;
}

export default useSpotifyClient;
