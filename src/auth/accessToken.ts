import { CLIENT_ID, REDIRECT_URI } from './constants';
import AuthStore from './store';

const TOKEN_URL = new URL('https://accounts.spotify.com/api/token');

type SpotifyTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export async function getAccessToken(
  code: string,
  verifier: string,
): Promise<[string, string, number]> {
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier,
    }),
  };

  const body = await window.fetch(TOKEN_URL, payload);
  const response = (await body.json()) as SpotifyTokenResponse; // TODO error

  return [response.access_token, response.refresh_token, response.expires_in];
}

export const getRefreshToken = async () => {
  const store = new AuthStore();
  const refreshToken = store.getRefreshToken();

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
  };

  const body = await window.fetch(TOKEN_URL, payload);
  const response = (await body.json()) as SpotifyTokenResponse;

  store.setTokens(
    response.access_token,
    response.refresh_token,
    response.expires_in,
  );
};
