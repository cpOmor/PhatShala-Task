

// Update the import path if the file is located elsewhere, for example:
import { tagTypes } from "../../features/tag-types"
import { baseApi } from "../../api/baseApi"

const resendVerificationCodeApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        resendVerificationCode:builder.mutation({
            query:(userInfo)=>({
                url:'/auth/resend-verification-code',
                method:'PUT',
               
                body:userInfo
              
            }),

            invalidatesTags:[tagTypes.resendVerificationCode]
        })
    })
})

export const {useResendVerificationCodeMutation} = resendVerificationCodeApi

