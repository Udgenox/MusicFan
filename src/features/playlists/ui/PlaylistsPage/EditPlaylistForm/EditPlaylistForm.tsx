import {useUpdatePlaylistMutation} from "@/features/playlists/api/playlistsApi";
import type {UpdatePlaylistArgs} from "@/features/playlists/api/playlistsApi.types";
import type {SubmitHandler, UseFormHandleSubmit, UseFormRegister} from "react-hook-form";

type Props = {
    playlistId: string
    setPlaylistId: (playlistId: null) => void
    editPlaylist: (playlist: null) => void
    register: UseFormRegister<UpdatePlaylistArgs>
    handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
}

export const EditPlaylistForm = ({
                                     playlistId,
                                     handleSubmit,
                                     register,
                                     editPlaylist,
                                     setPlaylistId,
                                 }: Props) => {
    const [updatePlaylist] = useUpdatePlaylistMutation()

    const onSubmit: SubmitHandler<UpdatePlaylistArgs> = data => {
        if (!playlistId) return
        updatePlaylist({ playlistId, body: data })
        setPlaylistId(null)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Edit playlist</h2>
            <div>
                <input {...register('data.attributes.title')} placeholder="title" required />
            </div>
            <div>
                <input {...register('data.attributes.description')} placeholder="description" />
            </div>
            <button type="submit">save</button>
            <button type="button" onClick={() => editPlaylist(null)}>cancel</button>
        </form>
    )
}