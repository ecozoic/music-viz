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
    window.localStorage.setItem(
      STORAGE_KEYS.EXPIRES_IN,
      (Date.now() + expiresIn * 1000).toString(),
    );
  }

  getRefreshToken(): string {
    const token = window.localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (token == null) {
      throw new Error('No refresh token set');
    }
    return token;
  }

  getAccessToken(): string {
    const token = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token == null) {
      throw new Error('No access token set');
    }
    return token;
  }

  isAccessTokenExpired(): boolean {
    const expiresIn = Number(
      window.localStorage.getItem(STORAGE_KEYS.EXPIRES_IN) ?? '0',
    );
    return Date.now() > expiresIn;
  }

  logout(): void {
    window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.EXPIRES_IN);
  }
}

export default AuthStore;
