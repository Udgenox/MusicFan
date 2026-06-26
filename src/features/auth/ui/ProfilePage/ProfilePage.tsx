import {Path} from "@/common/routing";
import {useGetMeQuery} from "@/features/auth/api/authApi";
import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlistsApi";
import {CreatePlaylistForm} from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm";
import {PlaylistsList} from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList";
import {Navigate} from "react-router";
import s from './ProfilePage.module.css'

export const ProfilePage = () => {
    const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery()
    const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery(
        {userId: meResponse?.userId},
        { skip: !meResponse?.userId },
        )

    if (isLoading || isMeLoading) return <h1>Skeleton loader...</h1>

    if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />


    return (
        <div>
            <h1>{meResponse?.login}</h1>
            <div className={s.container}>
                <CreatePlaylistForm />
                <PlaylistsList playlists={playlistsResponse?.data || []} isPlaylistsLoading={isLoading || isMeLoading} />
            </div>

        </div>
    )
}