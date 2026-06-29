import {baseApi} from "@/app/api/BaseApi";
import {SOCKET_EVENTS} from "@/common/constants";
import {imagesSchema} from "@/common/schemas";
import {subscribeToEvent} from "@/common/socket";
import type {Images} from "@/common/types/types";
import {withZodCatch} from "@/common/utils";
import type {
    CreatePlaylistArgs,
    FetchPlaylistsArgs,
    PlaylistAttributes,
    PlaylistCreatedEvent, PlaylistUpdatedEvent,
    UpdatePlaylistArgs
} from "@/features/playlists/api/playlistsApi.types";
import {playlistCreateResponseSchema, playlistsResponseSchema} from "@/features/playlists/model/playlists.schemas";


export const playlistsApi = baseApi.injectEndpoints({
    endpoints: build => ({
        fetchPlaylists: build.query({
            query: (params: FetchPlaylistsArgs) => ({ url: `playlists`, params }),
            ...withZodCatch(playlistsResponseSchema),
            keepUnusedDataFor: 0, // 👈 очистка сразу после размонтирования
            async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                // Ждем разрешения начального запроса перед продолжением
                await cacheDataLoaded

                const unsubscribes = [
                    subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, msg => {
                        const newPlaylist = msg.payload.data
                        updateCachedData(state => {
                            state.data.pop()
                            state.data.unshift(newPlaylist)
                            state.meta.totalCount = state.meta.totalCount + 1
                            state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
                        })
                    }),
                    subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, msg => {
                        const newPlaylist = msg.payload.data
                        updateCachedData(state => {
                            const index = state.data.findIndex(playlist => playlist.id === newPlaylist.id)
                            if (index !== -1) {
                                state.data[index] = { ...state.data[index], ...newPlaylist }
                            }
                        })
                    }),
                ]

                // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
                await cacheEntryRemoved
                unsubscribes.forEach(unsubscribe => unsubscribe())
            },
            providesTags: ['Playlists'],
        }),
        createPlaylist: build.mutation({
            query: (body : CreatePlaylistArgs) => ({
                url: 'playlists',
                method: 'post',
                body,
            }),
            ...withZodCatch(playlistCreateResponseSchema),
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
                method: "put",
                body,
            }),
            async onQueryStarted(
                { playlistId, body },
                { dispatch, queryFulfilled, getState }
            ) {
                const args = playlistsApi.util.selectCachedArgsForQuery(
                    getState(),
                    "fetchPlaylists"
                );
                console.log('🔍 Найдено кешей:', args.length, args); // ⬅️ Лог 1

                const patchResults: any[] = [];

                const cleanAttributes = { ...body.data.attributes } as Partial<PlaylistAttributes>;
                Object.keys(cleanAttributes).forEach((key) => {
                    if (cleanAttributes[key as keyof PlaylistAttributes] === null) {
                        delete cleanAttributes[key as keyof PlaylistAttributes];
                    }
                });

                args.forEach((arg) => {
                    console.log('🔄 Обновляем кеш с аргументами:', arg); // ⬅️ Лог 2
                    patchResults.push(
                        dispatch(
                            playlistsApi.util.updateQueryData(
                                "fetchPlaylists",
                                arg, // ⬅️ ВАЖНО: передаём весь объект arg, а не только pageNumber/pageSize/search
                                (state) => {
                                    const index = state.data.findIndex(
                                        (playlist) => playlist.id === playlistId
                                    );
                                    console.log('📦 Индекс плейлиста:', index, 'данные:', state.data[index]); // ⬅️ Лог 3
                                    if (index !== -1) {
                                        state.data[index].attributes = {
                                            ...state.data[index].attributes,
                                            ...cleanAttributes,
                                        };
                                        console.log('✅ Обновлено:', state.data[index].attributes); // ⬅️ Лог 4
                                    }
                                }
                            )
                        )
                    );
                });

                try {
                    await queryFulfilled;
                } catch {
                    patchResults.forEach((patchResult) => patchResult.undo());
                }
            },
            invalidatesTags: ["Playlists"], // оставлен по вашему желанию
        }),
        uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
            query: ({ playlistId, file }) => {
                const formData = new FormData()
                formData.append('file', file)
                return {
                    url: `playlists/${playlistId}/images/main`,
                    method: 'post',
                    body: formData,
                }
            },
            ...withZodCatch(imagesSchema),
            invalidatesTags: ['Playlists'],
        }),
        deletePlaylistCover: build.mutation<void, { playlistId: string }>({
            query: ({ playlistId }) => ({ url: `playlists/${playlistId}/images/main`, method: 'delete' }),
            invalidatesTags: ['Playlists'],
        }),
    }),
})

export const { useFetchPlaylistsQuery, useCreatePlaylistMutation, useDeletePlaylistMutation, useUpdatePlaylistMutation, useUploadPlaylistCoverMutation, useDeletePlaylistCoverMutation } = playlistsApi