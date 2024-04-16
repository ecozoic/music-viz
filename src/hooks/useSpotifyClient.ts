import { useMemo } from 'react';
import { useStore } from 'react-redux';

import { useAppDispatch } from '../app/hooks';
import { refreshToken } from '../features/auth/authSlice';
import SpotifyClient from '../api/client';
import { RootState } from '../app/store';

function useSpotifyClient() {
  const dispatch = useAppDispatch();
  const store = useStore();

  const client = useMemo(() => {
    return new SpotifyClient(
      store.getState as () => RootState,
      dispatch,
      refreshToken,
    );
  }, [store.getState, dispatch]);

  return client;
}

export default useSpotifyClient;
