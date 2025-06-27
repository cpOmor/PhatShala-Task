import { baseApi } from "../baseApi"

const registerApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        registation:builder.mutation({
            query:(userInfo)=>({
                url:'/student/create-student',
                method:'POST',
                body:userInfo
            })
        })
    })
})

export const {useRegistationMutation} = registerApi