
import { tagTypes } from "../../features/tag-types"
import { baseApi } from "../baseApi"

const commentApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({

        createComment:builder.mutation({
            query:(userInfo)=>({
                url:'/comment/create-comment',
                method:'POST',
                body:userInfo
              
            }),

            invalidatesTags:[tagTypes.createComment]
        }),
       

        getComment: builder.query({
          query: ({ id, query }) => ({
            url: `/comment/comments-by-book/${id}?searchTerm=${query?.searchTerm}&page=${query?.page}&limit=${query?.limit}`,
            method: "GET",
          }),
          providesTags: [tagTypes.createComment],
          keepUnusedDataFor: 0,
        }),
     
        
        getAllComment: builder.query({
          query: ( query ) => ({
            url: `/comment/comments/?searchTerm=${query?.searchTerm}&startDate=${query?.startDate}&endDate=${query?.endDate}&page=${query?.page}&limit=${query?.limit}`,
            method: "GET",
          }),
          providesTags: [tagTypes.createComment],
          keepUnusedDataFor: 0,
        }),
     
        


          deleteComment: builder.mutation({
            query: (id) => {
              return {
                url: `/comment/delete-comment/${id}`,
                method: "DELETE",
              };
            },
            invalidatesTags: [tagTypes.createComment],
          }),

       

    })
})

export const {useCreateCommentMutation,useGetCommentQuery,useDeleteCommentMutation,useGetAllCommentQuery} = commentApi

