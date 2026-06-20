import {useGetMeQuery} from "@/features/auth/api/authApi";

export const MainPage = () => {
    const { data } = useGetMeQuery()

    return (
        <div>
            <h1>{data?.login}</h1>
        </div>
    )
}