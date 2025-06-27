import { baseApi } from "../baseApi"

const verifyAccount = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        verifyAccount:builder.mutation({
            query:(data)=>({
                url:'/auth/verification',
                method:'POST',
                body:data
            })
        })
    })
})

export const {useVerifyAccountMutation} = verifyAccount