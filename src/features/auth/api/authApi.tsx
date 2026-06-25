import {baseApi} from "@/app/api/BaseApi";
import {AUTH_KEYS} from "@/common/constants";
import type {LoginArgs, LoginResponse, MeResponse} from "@/features/auth/api/authApi.types";

export const authApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getMe: build.query<MeResponse, void>({
            query: () => `auth/me`,
            providesTags: ['Auth']
        }),
        login: build.mutation<LoginResponse, LoginArgs>({
            query: payload => ({
                url: `auth/login`,
                method: 'post',
                body: { ...payload, accessTokenTTL: '3m' },
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled
                localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
                localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)
                // Invalidate after saving tokens
                dispatch(authApi.util.invalidateTags(['Auth']))
            },
        }),
        logout: build.mutation<void, void>({
            query: () => {
                const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
                return { url: 'auth/logout', method: 'post', body: { refreshToken } }
            },
            async onQueryStarted(_args, { queryFulfilled, dispatch }) {
                await queryFulfilled
                localStorage.removeItem(AUTH_KEYS.accessToken)
                localStorage.removeItem(AUTH_KEYS.refreshToken)
                dispatch(baseApi.util.resetApiState())
            },
        }),
    }),
})

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi