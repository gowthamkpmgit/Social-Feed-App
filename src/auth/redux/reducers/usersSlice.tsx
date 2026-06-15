import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  username: string;
  password: string;
}

interface UsersState {
  users: User[];
  currentUser: User | undefined;
  isAuthenticated: boolean;
  loginError: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: undefined,
  isAuthenticated: false,
  loginError: null,
};

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<User>) => {
      const isUserAlreadyPresent = state.users.find(
        (item) => item.username === action.payload.username,
      );
      if (!isUserAlreadyPresent) {
        state.users.push(action.payload);
      }
    },
    loginUser: (
      state,
      action: PayloadAction<{ username: string; password: string }>,
    ) => {
      const reqDetails = action.payload;
      const isAuthenticateUser = state.users.find(
        (item) =>
          item.username === reqDetails.username &&
          item.password === reqDetails.password,
      );
      if (isAuthenticateUser) {
        state.currentUser = isAuthenticateUser;
        state.isAuthenticated = true;
        state.loginError = null;
      } else {
        state.isAuthenticated = false;
        state.loginError = "Invalid username or password";
      }
    },
    logoutUser: (state) => {
      state.currentUser = undefined;
      state.isAuthenticated = false;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
  },
});

export const { registerUser, loginUser, logoutUser, clearLoginError } =
  usersSlice.actions;

export default usersSlice.reducer;
