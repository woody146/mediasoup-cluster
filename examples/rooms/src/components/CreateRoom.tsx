import { fetchApi } from '../services';
import { join } from './JoinRoom';

export function CreateRoom({ onSuccess }: { onSuccess: (data: any) => void }) {
  const createRoom = async () => {
    const data = await fetchApi({ path: '/api/rooms', method: 'POST' });
    join(data.id, onSuccess);
  };
  return (
    <button
      className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-md shadow-sm border-2 border-blue-500 w-full"
      onClick={() => createRoom()}
    >
      Create Room
    </button>
  );
}
