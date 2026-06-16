import type {
    CreatePlaylistArgs,
    PlaylistData,
    PlaylistsResponse,
    UpdatePlaylistArgs
} from "@/features/playlists/api/playlistsApi.types";
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const playlistsApi = createApi({
    reducerPath: 'playlistsApi',
    tagTypes: ['Playlists'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        headers: {
            'API-KEY': import.meta.env.VITE_API_KEY,
        },
        prepareHeaders: headers => {
            headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
            return headers
        },
    }),
    endpoints: build => ({
        fetchPlaylists: build.query<PlaylistsResponse, void>({
            query: () => {
                return {
                    method: 'get',
                    url: `playlists`,
                }
            },
            providesTags: ['Playlists']
        }),
        createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
            query: body => ({
                url: 'playlists',
                method: 'post',
                body,
            }),
            invalidatesTags: ['Playlists']
        }),
        deletePlaylist: build.mutation<void, string>({
            query: playlistId => ({
                url: `playlists/${playlistId}`,
                method: 'delete',
            }),
            invalidatesTags: ['Playlists']
        }),
        updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
            query: ({ playlistId, body }) => ({
                url: `playlists/${playlistId}`,
                method: 'put',
                body,
            }),
            invalidatesTags: ['Playlists']
        }),
    }),
})

export const { useFetchPlaylistsQuery, useCreatePlaylistMutation, useDeletePlaylistMutation, useUpdatePlaylistMutation } = playlistsApi