import {
    playlistAttributesSchema,
    playlistDataSchema,
    type playlistMetaSchema, playlistsResponseSchema
} from "@/features/playlists/model/playlists.schemas";
// import type { CurrentUserReaction } from '@/common/enums'
// import type { Images, Tag, User } from '@/common/types/types'
import * as z from "zod";

export type PlaylistMeta = z.infer<typeof playlistMetaSchema>
export type PlaylistAttributes = z.infer<typeof playlistAttributesSchema>
export type PlaylistData = z.infer<typeof playlistDataSchema>
export type PlaylistsResponse = z.infer<typeof playlistsResponseSchema>

// export type PlaylistsResponse = {
//     data: PlaylistData[]
//     meta: PlaylistMeta
// }
//
// export type PlaylistData = {
//     id: string
//     type: 'playlists'
//     attributes: PlaylistAttributes
// }
//
// export type PlaylistMeta = {
//     page: number
//     pageSize: number
//     totalCount: number
//     pagesCount: number
// }
//
// export type PlaylistAttributes = {
//     title: string
//     description?: string
//     addedAt: string
//     updatedAt: string
//     order: number
//     dislikesCount: number
//     likesCount: number
//     tracksCount: number // Добавлено
//     duration: number    // Добавлено
//     tags: Tag[]
//     images: Images
//     user: User
//     currentUserReaction: CurrentUserReaction
// }

// Arguments
export type FetchPlaylistsArgs = {
    pageNumber?: number
    pageSize?: number
    search?: string
    sortBy?: 'addedAt' | 'likesCount'
    sortDirection?: 'asc' | 'desc'
    tagsIds?: string[]
    userId?: string
    trackId?: string
}

// export type CreatePlaylistArgs = {
//     title: string
//     description: string
// }

export type BasePlaylistArgs<T> = {
    data: {
        type: 'playlists'
        attributes: T
    }
}

export type CreatePlaylistArgs = BasePlaylistArgs<{
    title: string
    description?: string
}>

export type UpdatePlaylistArgs = BasePlaylistArgs<Partial<{
    title: string
    description?: string | null
    tagIds: string[]
}>>

// WebSocket Events
export type PlaylistCreatedEvent = {
    type: 'tracks.playlist-created'
    payload: {
        data: PlaylistData
    }
}

export type PlaylistUpdatedEvent = {
    type: 'tracks.playlist-updated'
    payload: {
        data: PlaylistData
    }
}

