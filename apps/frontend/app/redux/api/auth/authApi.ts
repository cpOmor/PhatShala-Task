import { tagTypes } from "../../features/tag-types";
import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  
    getMe: builder.query({
      query: () => ({
        url: `/auth/get-me`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutUserMutation,
  useGetMeQuery,
} = authApi;
