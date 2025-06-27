import { baseApi } from "../../api/baseApi"

const forgotpasswordApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        forgetPassword:builder.mutation({
            query:(data)=>({
                url:'/auth/forget-password',
                method:'POST',
                body:data
            })
        })
    })
})

export const {useForgetPasswordMutation} = forgotpasswordApi