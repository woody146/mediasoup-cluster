import { fetchApi } from '../services';

export function CreateRoom({ onSuccess }: { onSuccess: (data: any) => void }) {
  const createRoom = async () => {
    const data = await fetchApi({ path: '/api/rooms', method: 'POST' });
    onSuccess(data);
  };
  return (
    <button
      className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-slate-50 ring-blue-500"
      onClick={() => createRoom()}
    >
      Create Room
    </button>
  );
}
