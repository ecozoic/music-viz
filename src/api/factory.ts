import { AppStore } from '../app/store';
import SpotifyClient from './client';
import { refreshToken } from '../features/auth/authSlice';

export function fromStore(store: AppStore): SpotifyClient {
  return new SpotifyClient(
    () => store.getState().auth.accessToken,
    () => store.getState().auth.expiresIn,
    () => store.dispatch(refreshToken()),
  );
}
