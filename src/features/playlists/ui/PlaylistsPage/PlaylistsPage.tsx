import {Pagination} from "@/common/components";
import {useDebounceValue} from "@/common/hooks";
import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlistsApi";
import {CreatePlaylistForm} from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm";
import {PlaylistsList} from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList";
import {type ChangeEvent, useState} from "react";
import s from './PlaylistsPage.module.css';

export type EditFormValues = {
    title: string;
    description: string | null; // всегда строка (может быть пустой)
    tagIds: string[];
};

export const PlaylistsPage = () => {

    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(32)
    const debounceSearch = useDebounceValue(search)

    const { data, isLoading } = useFetchPlaylistsQuery({ search: debounceSearch, pageNumber: currentPage, pageSize })




    const setPageSizeHandler = (size: number) => {
        setCurrentPage(1)
        setPageSize(size)
    }

    const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value)
        setCurrentPage(1)
    }

    return (
        <div className={s.container}>
            <h1>Playlists page</h1>
            <CreatePlaylistForm />
            <input
                type="search"
                placeholder={'Search playlist by title'}
                onChange={searchPlaylistHandler}
            />
            <PlaylistsList playlists={data?.data || []} isPlaylistsLoading={isLoading}/>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagesCount={data?.meta.pagesCount || 1}
                pageSize={pageSize}
                changePageSize={setPageSizeHandler}
            />
        </div>
    )
}