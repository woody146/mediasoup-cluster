import { useState } from 'react';
import { fetchApi } from '../services';

export async function join(roomId: string, onSuccess: (data: any) => void) {
  if (roomId) {
    const routerData = await fetchApi({
      path: `/api/rooms/${roomId}/consumer_routers`,
      method: 'POST',
    });
    onSuccess({
      roomId,
      routerId: routerData.id,
      rtpCapabilities: routerData.rtpCapabilities,
    });
  }
}

export function JoinRoom({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [roomId, setRoomId] = useState('');

  return (
    <span>
      <input
        placeholder="Room id"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-slate-50 ring-blue-500"
      />
      <button
        className="ml-4 px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-slate-50 ring-blue-500 disabled:opacity-50"
        onClick={() => join(roomId, onSuccess)}
        disabled={!roomId}
      >
        Join Room
      </button>
    </span>
  );
}
