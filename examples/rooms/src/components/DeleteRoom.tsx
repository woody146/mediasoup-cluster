import { useState } from 'react';
import { fetchApi } from '../services';

export function DeleteRoom() {
  const [roomId, setRoomId] = useState('');

  const deleteRoom = async () => {
    await fetchApi({
      path: '/api/rooms/' + roomId,
      method: 'DELETE',
    });
    setRoomId('');
  };
  return (
    <div className="flex justify-center">
      <input
        placeholder="Room id"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="flex-1 px-4 py-2 bg-white text-slate-700 border rounded-l-md shadow-sm border-2 border-orange-500"
      />
      <button
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-r-md shadow-sm border-2 border-orange-500 disabled:opacity-50"
        onClick={() => deleteRoom()}
        disabled={!roomId}
      >
        Delete Room
      </button>
    </div>
  );
}
