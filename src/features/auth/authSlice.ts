import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
import genCodeVerifierAndChallenge from '../../auth/codeChallenge';
import requestSpotifyUserAuthorization from '../../auth/userAuthorization';
import AuthStore from '../../auth/store';
import type { RootState } from '../../app/store';
import { getAccessToken } from '../../auth/accessToken';

export interface AuthState {
  isAuthenticated: boolean;
  codeChallenge: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  codeChallenge: null,
};

const genCodeChallenge = createAsyncThunk(
  'auth/genCodeChallengeStatus',
  async () => {
    return await genCodeVerifierAndChallenge();
  },
);

// TODO: return value of dispatch then
export const requestUserAuthorization = createAsyncThunk(
  'auth/requestUserAuthorizationStatus',
  async (_, thunkAPI) => {
    return thunkAPI.dispatch(genCodeChallenge()).then(() => {
      const state = thunkAPI.getState() as RootState;
      requestSpotifyUserAuthorization(state.auth.codeChallenge!);
    });
  },
);

export const login = createAsyncThunk(
  'auth/loginStatus',
  async (code: string, _thunkAPI) => {
    const store = new AuthStore();
    const verifier = store.getCodeVerifier();

    return await getAccessToken(code, verifier);
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      const store = new AuthStore();
      store.logout();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(genCodeChallenge.fulfilled, (state, action) => {
      const [verifier, challenge] = action.payload;
      state.codeChallenge = challenge;
      // persist verifier in local storage so we can reference it after redirect to callback url
      const store = new AuthStore();
      store.setCodeVerifier(verifier);
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      const [accessToken, refreshToken, expiresIn] = action.payload;
      const store = new AuthStore();
      store.clearCodeVerifier();
      store.setTokens(accessToken, refreshToken, expiresIn);
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
