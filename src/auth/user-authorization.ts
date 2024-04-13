import { CLIENT_ID } from './constants';

const requestUserAuthorization = (codeChallenge: string) => {
    localStorage.setItem('code_challenge', codeChallenge);
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = {
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: 'user-read-private user-read-email',
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: 'http://localhost:5173', // TODO redirect URI
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

export default requestUserAuthorization;