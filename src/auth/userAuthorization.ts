import { CLIENT_ID, REDIRECT_URI } from './constants';

const requestUserAuthorization = (codeChallenge: string) => {
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: 'user-read-private user-read-email streaming',
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI, // TODO redirect URI
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};

export default requestUserAuthorization;
