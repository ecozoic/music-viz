import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import genSpotifyCodeVerifierAndChallenge from '../../auth/codeChallenge';
import requestSpotifyUserAuthorization from '../../auth/userAuthorization';
import AuthStore from '../../auth/store';
import {
  getAccessToken,
  expiresInToTimestamp,
  getRefreshToken,
} from '../../auth/accessToken';
import SpotifyClient from '../../api/client';
import { RootState } from '../../app/store';

export interface AuthState {
  isAuthenticated: boolean;
  isLoginPending: boolean;
  displayName: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
}

const getInitialState: () => AuthState = () => {
  const store = new AuthStore();

  const accessToken = store.getAccessToken() ?? null;
  const displayName = store.getSpotifyUser() ?? null;
  const refreshToken = store.getRefreshToken() ?? null;
  const expiresIn = store.getExpiresIn() ?? null;

  return {
    isAuthenticated:
      accessToken !== null &&
      displayName !== null &&
      refreshToken !== null &&
      expiresIn !== null,
    isLoginPending: false,
    accessToken,
    displayName,
    refreshToken,
    expiresIn,
  };
};

const genCodeVerifierAndChallenge = createAsyncThunk(
  'auth/genCodeVerifierAndChallengeStatus',
  async () => {
    return await genSpotifyCodeVerifierAndChallenge();
  },
);

export const requestUserAuthorization = createAsyncThunk(
  'auth/requestUserAuthorizationStatus',
  async (_arg, thunkAPI) => {
    const [_verifier, challenge] = await thunkAPI
      .dispatch(genCodeVerifierAndChallenge())
      .unwrap();
    requestSpotifyUserAuthorization(challenge);
  },
);
const requestAccessToken = createAsyncThunk(
  'auth/requestAccessTokenStatus',
  async (code: string, _thunkAPI) => {
    const store = new AuthStore();
    const verifier = store.getCodeVerifier();

    return await getAccessToken(code, verifier);
  },
);

export const refreshToken = createAsyncThunk(
  'auth/refreshTokenStatus',
  async (_arg, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const token = state.auth.refreshToken;
    return await getRefreshToken(token!);
  },
);

const requestCurrentUserProfile = createAsyncThunk(
  'auth/requestCurrentUserProfileStatus',
  async (_arg, thunkAPI) => {
    const client = new SpotifyClient(
      () => (thunkAPI.getState() as RootState).auth.accessToken,
      () => (thunkAPI.getState() as RootState).auth.expiresIn,
      () => thunkAPI.dispatch(refreshToken()),
    );
    return await client.me();
  },
);

export const login = createAsyncThunk(
  'auth/loginStatus',
  async (code: string, thunkAPI) => {
    await thunkAPI.dispatch(requestAccessToken(code));
    await thunkAPI.dispatch(requestCurrentUserProfile()).unwrap();
  },
  {
    condition: (_code: string, { getState }) => {
      // login dispatched in useEffect so add condition
      // to prevent double firing of thunk in dev mode
      const state = getState() as RootState;
      return !state.auth.isLoginPending;
    },
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.expiresIn = null;
      state.refreshToken = null;
      state.displayName = null;
      const store = new AuthStore();
      store.logout();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(genCodeVerifierAndChallenge.fulfilled, (_state, action) => {
      const [verifier, _challenge] = action.payload;
      // persist verifier in local storage so we can reference it after redirect to callback url
      const store = new AuthStore();
      store.setCodeVerifier(verifier);
    });

    builder.addCase(requestAccessToken.fulfilled, (state, action) => {
      const [accessToken, refreshToken, expiresIn] = action.payload;
      state.isAuthenticated = true;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresIn = expiresInToTimestamp(expiresIn);
      const store = new AuthStore();
      store.clearCodeVerifier();
      store.setTokens(state.accessToken, state.refreshToken, state.expiresIn);
    });

    builder.addCase(requestCurrentUserProfile.fulfilled, (state, action) => {
      state.displayName = action.payload.display_name;
      const store = new AuthStore();
      store.setSpotifyUser(state.displayName);
    });

    builder.addCase(login.pending, (state) => {
      state.isLoginPending = true;
    });

    builder.addCase(login.rejected, (state) => {
      state.isLoginPending = false;
    });

    builder.addCase(login.fulfilled, (state) => {
      state.isAuthenticated = true;
      state.isLoginPending = false;
    });

    builder.addCase(refreshToken.fulfilled, (state, action) => {
      const [accessToken, refreshToken, expiresIn] = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.expiresIn = expiresInToTimestamp(expiresIn);
      const store = new AuthStore();
      store.clearCodeVerifier();
      store.setTokens(state.accessToken, state.refreshToken, state.expiresIn);
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
