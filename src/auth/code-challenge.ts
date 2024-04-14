import AuthStore from './store';

// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
const getCodeVerifier = (length: number = 64) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = window.crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const genCodeChallenge = async () => {
  const verifier = getCodeVerifier();
  const store = new AuthStore();
  store.setCodeVerifier(verifier);
  const hashed = await sha256(verifier);
  return base64encode(hashed);
};

export default genCodeChallenge;
