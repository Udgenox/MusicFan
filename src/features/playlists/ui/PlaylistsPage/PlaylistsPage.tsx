import {
    useDeletePlaylistMutation,
    useFetchPlaylistsQuery,
    useUpdatePlaylistMutation
} from "@/features/playlists/api/playlistsApi";
import type { PlaylistData } from "@/features/playlists/api/playlistsApi.types";
import { CreatePlaylistForm } from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import s from './PlaylistsPage.module.css';

type EditFormValues = {
    title: string;
    description: string; // всегда строка (может быть пустой)
};

export const PlaylistsPage = () => {
    const [playlistId, setPlaylistId] = useState<string | null>(null);
    const [currentTagIds, setCurrentTagIds] = useState<string[]>([]);
    const { register, handleSubmit, reset } = useForm<EditFormValues>();
    const { data } = useFetchPlaylistsQuery();
    const [deletePlaylist] = useDeletePlaylistMutation();
    const [updatePlaylist] = useUpdatePlaylistMutation();

    const deletePlaylistHandler = (id: string) => {
        if (confirm('Are you sure?')) {
            deletePlaylist(id);
        }
    };

    const editPlaylistHandler = (playlist: PlaylistData | null) => {
        if (playlist) {
            setPlaylistId(playlist.id);
            setCurrentTagIds(playlist.attributes.tags.map(tag => tag.id));
            reset({
                title: playlist.attributes.title,
                description: playlist.attributes.description ?? '', // пустая строка вместо undefined
            });
        } else {
            setPlaylistId(null);
            setCurrentTagIds([]);
        }
    };

    const onSubmit: SubmitHandler<EditFormValues> = async ({ title, description }) => {
        if (!playlistId) return;
        try {
            const attributes = {
                title,
                tagIds: currentTagIds,          // обязательное поле
                description: description ?? '', // всегда строка (пустая, если не указана)
            };
            const body = {
                data: {
                    type: 'playlists' as const,
                    attributes,
                },
            };
            await updatePlaylist({ playlistId, body }).unwrap();
            setPlaylistId(null);
        } catch (error) {
            console.error('Update error:', error);
            alert('Не удалось обновить плейлист');
        }
    };

    return (
        <div className={s.container}>
            <h1>Playlists page</h1>
            <CreatePlaylistForm />
            <div className={s.items}>
                {data?.data.map(playlist => {
                    const isEditing = playlistId === playlist.id;
                    return (
                        <div className={s.item} key={playlist.id}>
                            {isEditing ? (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h2>Edit playlist</h2>
                                    <div>
                                        <input {...register('title')} placeholder="title" required />
                                    </div>
                                    <div>
                                        <input {...register('description')} placeholder="description" />
                                    </div>
                                    <button type="submit">save</button>
                                    <button type="button" onClick={() => editPlaylistHandler(null)}>cancel</button>
                                </form>
                            ) : (
                                <div>
                                    <div>title: {playlist.attributes.title}</div>
                                    <div>description: {playlist.attributes.description}</div>
                                    <div>userName: {playlist.attributes.user.name}</div>
                                    <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
                                    <button onClick={() => editPlaylistHandler(playlist)}>update</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};