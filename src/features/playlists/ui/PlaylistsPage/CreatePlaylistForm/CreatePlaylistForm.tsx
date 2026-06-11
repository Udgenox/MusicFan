import { useForm } from 'react-hook-form';
import { useCreatePlaylistMutation } from '@/features/playlists/api/playlistsApi';

type FormValues = {
    title: string;
    description?: string;
};

export const CreatePlaylistForm = () => {
    const { register, handleSubmit, reset } = useForm<FormValues>();
    const [createPlaylist, { isLoading }] = useCreatePlaylistMutation();

    const onSubmit = (data: FormValues) => {
        createPlaylist({
            data: {
                type: "playlists",
                attributes: data,   // data: { title, description? }
            },
        })
            .unwrap()
            .then(() => {
                reset();   // очищаем форму после успешного создания
            })
            .catch((error) => {
                console.error('Ошибка создания плейлиста:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Название</label>
                <input {...register('title', { required: true })} />
            </div>
            <div>
                <label>Описание</label>
                <input {...register('description')} />
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Создание...' : 'Создать плейлист'}
            </button>
        </form>
    );
};