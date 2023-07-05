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
    <div className="flex justify-center">
      <input
        placeholder="Room id"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="flex-1 px-4 py-2 bg-white text-slate-700 border rounded-l-md shadow-sm border-2 border-blue-500"
      />
      <button
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-r-md shadow-sm border-2 border-blue-500 disabled:opacity-50"
        onClick={() => join(roomId, onSuccess)}
        disabled={!roomId}
      >
        Join Room
      </button>
    </div>
  );
}
