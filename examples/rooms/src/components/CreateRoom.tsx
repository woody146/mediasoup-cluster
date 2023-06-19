import { fetchApi } from '../services';
import { join } from './JoinRoom';

export function CreateRoom({ onSuccess }: { onSuccess: (data: any) => void }) {
  const createRoom = async () => {
    const data = await fetchApi({ path: '/api/rooms', method: 'POST' });
    join(data.id, onSuccess);
  };
  return (
    <span>
      <button
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-slate-50 ring-blue-500"
        onClick={() => createRoom()}
      >
        Create Room
      </button>
    </span>
  );
}
