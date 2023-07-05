import { ClientRoom } from 'mediasoup-client-utils';
import { useEffect, useState } from 'react';
import { join } from './JoinRoom';
import { Consumers } from './Consumer';

const InvisibleConsumer = ({ roomId }: { roomId: string }) => {
  const [room, setRoom] = useState<ClientRoom>();

  useEffect(() => {
    join(roomId, async (data) => {
      const clientRoom = new ClientRoom(roomId, data.routerId);
      await clientRoom.initDevice({
        routerRtpCapabilities: data.rtpCapabilities,
      });
      setRoom(clientRoom);
    });
  }, []);
  return (
    <div style={{ display: 'none' }}>
      {room && <Consumers room={room} userId="test" />}
    </div>
  );
};

export const ConsumerCloner = ({ roomId }: { roomId: string }) => {
  const [count, setCount] = useState(0);

  const addClients = (quantity: number) => {
    console.log(roomId);
    setCount(count + quantity);
  };

  return (
    <div>
      <div className="grid grid-flow-col justify-stretch mb-4" role="group">
        <button
          type="button"
          className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-l-md shadow-sm border-2 border-pink-500"
          data-te-ripple-init
          data-te-ripple-color="light"
        >
          Clients: {count}
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
      {Array.from(Array(count).keys()).map((key) => (
        <InvisibleConsumer key={key} roomId={roomId} />
      ))}
    </div>
  );
};
