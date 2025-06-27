/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { RootState } from "../../features/store";
import { createSlice } from "@reduxjs/toolkit";

export type TUser = {
  firstName: string;
  lastName: string;
  phone?: string;
  alterNumber?: string;
  email: string;
  image?:any
  profilePicture?:any
  role: string;
  iat: number;
  exp: number;
  deviceId?: string;
  id: string;
  password: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      (state.user = user), (state.token = token);
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

   

    logout: (state) => {
      (state.user = null), (state.token = null);
    },
  },
});

export const { setUser, updateUser, logout} =
  authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
