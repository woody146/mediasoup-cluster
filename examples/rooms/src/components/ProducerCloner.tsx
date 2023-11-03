import { ClientRoom } from 'mediasoup-client-utils';
import { useState } from 'react';

import { Producer } from './Producer';

export const ProducerCloner = ({
  room,
  userId,
}: {
  room: ClientRoom;
  userId: string;
}) => {
  const [mode, setMode] = useState<'audio' | 'video'>('audio');
  const [count, setCount] = useState(0);
  const [success, setSuccess] = useState(0);

  const addClients = (quantity: number) => {
    setCount(count + quantity);
  };

  return (
    <div>
      <div className="grid grid-flow-col justify-stretch mb-4" role="group">
        <button
          type="button"
          className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-l-md shadow-sm border-2 border-pink-500 disabled:opacity-50"
          data-te-ripple-init
          data-te-ripple-color="light"
        >
          Clients: {success} / {count}
        </button>
        <button
          type="button"
          className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-none shadow-sm border-2 border-y-pink-500"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={() => addClients(1)}
        >
          + 1
        </button>
        <button
          type="button"
          className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-none shadow-sm border-2 border-l-pink-500 border-y-pink-500"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={() => addClients(10)}
        >
          + 10
        </button>
        <button
          type="button"
          className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-r-md shadow-sm border-2 border-pink-500"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={() => addClients(100)}
        >
          +100
        </button>
      </div>
      <div className="pb-4 flex justify-center space-x-4">
        <div>
          <input
            id="videoMode"
            type="radio"
            checked={mode === 'video'}
            onChange={() => setMode('video')}
            className="focus:ring-blue-500 mr-2"
            disabled={count > 0}
          />
          <label htmlFor="videoMode">Video</label>
        </div>
        <div>
          <input
            id="audioMode"
            type="radio"
            checked={mode === 'audio'}
            onChange={() => setMode('audio')}
            className="focus:ring-blue-500 mr-2"
            disabled={count > 0}
          />
          <label htmlFor="audioMode">Audio</label>
        </div>
      </div>
      {Array.from(Array(count).keys()).map((key) => (
        <div key={key} style={{ display: 'none' }}>
          <Producer
            room={room}
            userId={userId}
            autoProduce={mode}
            onSuccess={() => setSuccess((v) => v + 1)}
          />
        </div>
      ))}
    </div>
  );
};
