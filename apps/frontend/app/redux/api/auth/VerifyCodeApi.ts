import { baseApi } from "../baseApi"

const verifyCodeApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        verifyCode:builder.mutation({
            query:(data)=>({
                url:'/auth/verification',
                method:'POST',
                body:data
            })
        })
    })
})

export const {useVerifyCodeMutation} = verifyCodeApi