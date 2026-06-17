import type {PlaylistData} from "@/features/playlists/api/playlistsApi.types";
import {PlaylistCover} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistCover/PlaylistCover";
import {
    PlaylistDescription
} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistDescription/PlaylistDescription";

type Props = {
    playlist: PlaylistData;
    deletePlaylistHandler: (playlistId: string) => void;
    editPlaylistHandler: (playlist: PlaylistData) => void;
}

export const PlaylistItem = ({playlist,editPlaylistHandler, deletePlaylistHandler} : Props) => {

    return (
        <div>
            <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images}/>

            <PlaylistDescription attributes={playlist.attributes}/>

            <button onClick={() => editPlaylistHandler(playlist)}>update</button>
            <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
        </div>
    )
}