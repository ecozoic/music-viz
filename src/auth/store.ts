import { STORAGE_KEYS } from './constants';

class AuthStore {
  setCodeVerifier(verifier: string): void {
    window.localStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, verifier);
  }

  getCodeVerifier(): string {
    const verifier = window.localStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);
    if (verifier == null) {
      throw new Error('No code verifier set');
    }
    return verifier;
  }

  clearCodeVerifier(): void {
    window.localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
  }

  setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
  ): void {
    window.localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    window.localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    window.localStorage.setItem(STORAGE_KEYS.EXPIRES_IN, expiresIn.toString());
  }

  setSpotifyUser(username: string): void {
    window.localStorage.setItem(STORAGE_KEYS.SPOTIFY_USER, username);
  }

  getRefreshToken(): string | null {
    return window.localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  getAccessToken(): string | null {
    return window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getSpotifyUser(): string | null {
    return window.localStorage.getItem(STORAGE_KEYS.SPOTIFY_USER);
  }

  getExpiresIn(): number | null {
    const expiresIn = window.localStorage.getItem(STORAGE_KEYS.EXPIRES_IN);
    return expiresIn === null ? expiresIn : Number(expiresIn);
  }

  logout(): void {
    window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.EXPIRES_IN);
    window.localStorage.removeItem(STORAGE_KEYS.SPOTIFY_USER);
  }
}

export default AuthStore;
