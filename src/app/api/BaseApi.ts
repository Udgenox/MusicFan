import {baseQueryWithReauth} from "@/app/api/baseQueryWithReauth";
import {createApi} from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
    reducerPath: 'baseApi',
    tagTypes: ['Playlists', 'Auth'],
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
})