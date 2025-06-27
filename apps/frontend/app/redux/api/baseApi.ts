/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

import {
  BaseQueryFn,
  createApi,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../features/tag-types";
import { RootState } from "../features/store";
import { setUser } from "./auth/authSlice";


export const baseAPI = "http://localhost:5000/api/v1";



const axiosInstance = axios.create({
  baseURL: baseAPI,
  withCredentials: true,
});

const axiosBaseQuery: BaseQueryFn<
  FetchArgs | string,
  unknown,
  unknown
> = async (args, api) => {
  const { getState, dispatch } = api;
  const token = (getState() as RootState).auth.token;

  if (token) {
    axiosInstance.defaults.headers.common["authorization"] = `${token}`;
  }

  try {
    const response = await axiosInstance({
      url: typeof args === "string" ? args : args.url,
      method: typeof args !== "string" ? args.method : "GET",
      data: typeof args !== "string" ? args.body : undefined,
      params: typeof args !== "string" ? args.params : undefined,
    });
    return { data: response.data };
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 401) {
      const refreshResponse = await axiosInstance.post(
        `${baseAPI}/auth/refresh-token`
      );

      const newToken = refreshResponse.data?.data;

      if (newToken) {
        const user = (getState() as RootState).auth.user;

        dispatch(setUser({ user, token: newToken }));

        // Set the new token in headers for subsequent requests
        axiosInstance.defaults.headers.common["authorization"] = `${newToken}`;

        // Retrying the original request with the new token
        const retryResponse = await axiosInstance({
          url:
            typeof args === "string"
              ? args
              : args.url || `${baseAPI}/auth/refresh-token`,
          method: typeof args !== "string" ? args.method : "GET",
          data: typeof args !== "string" ? args.body : undefined,
          params: typeof args !== "string" ? args.params : undefined,
        });

        return { data: retryResponse.data };
      }
    }

    return { error: { status, data: error.response?.data } };
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
