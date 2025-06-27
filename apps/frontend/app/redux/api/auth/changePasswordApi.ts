import { baseApi } from "../../api/baseApi"

const changePassword = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        changePassword:builder.mutation({
            query:(data)=>({
                url:'/auth/change-password',
                method:'PUT',
                body:data
            })
        })
    })
})

export const {useChangePasswordMutation} = changePassword