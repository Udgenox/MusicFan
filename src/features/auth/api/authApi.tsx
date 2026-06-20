import {baseApi} from "@/app/api/BaseApi";
import type {MeResponse} from "@/features/auth/api/authApi.types";

export const authApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getMe: build.query<MeResponse, void>({
            query: () => `auth/me`,
        }),
    }),
})

export const { useGetMeQuery } = authApi