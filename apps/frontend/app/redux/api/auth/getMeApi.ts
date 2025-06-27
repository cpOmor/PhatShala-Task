import { tagTypes } from "../../features/tag-types"
import { baseApi } from "../baseApi"

const getMeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getme: builder.query({
        query: () => ({
          url: `/user/get-me`,
          method: "GET",
        }),
        providesTags: [tagTypes.getMe],
        keepUnusedDataFor: 0, 
      }),
    }),
  });
  export const {useGetmeQuery} = getMeApi