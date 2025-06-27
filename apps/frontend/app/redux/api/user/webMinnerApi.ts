
import { tagTypes } from "../../features/tag-types"
import { baseApi } from "../baseApi"

const webMinnerApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({

        createWebMinner:builder.mutation({
            query:(userInfo)=>({
                url:'/webinar/create-webinar',
                method:'POST',
                body:userInfo
              
            }),

            invalidatesTags:[tagTypes.createWebMinner]
        }),
       

        getWebMinner: builder.query({
            query: (query) => ({
              url: `/webinar/webinars?searchTerm=${query?.searchTerm}&startDate=${query?.startDate}&endDate=${query?.endDate}&page=${query?.page}&limit=${query?.limit}`,

              method: "GET",
            }),
            providesTags: [tagTypes.createWebMinner],
            keepUnusedDataFor: 0, 
          }),

       

    })
})

export const {useCreateWebMinnerMutation,useGetWebMinnerQuery} = webMinnerApi

