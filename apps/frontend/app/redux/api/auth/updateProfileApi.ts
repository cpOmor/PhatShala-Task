import { tagTypes } from "../../features/tag-types"
import { baseApi } from "../../api/baseApi"

const updateProfileApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        updateProfile:builder.mutation({
            query:(userInfo)=>({
                url:'/auth/update-me',
                method:'PUT',
               
                body:userInfo
              
            }),

            invalidatesTags:[tagTypes.updateProfile]
        })
    })
})

export const {useUpdateProfileMutation} = updateProfileApi

