import { types } from 'mediasoup-client';
import { useEffect, useMemo, useRef, useState } from 'react';

import { fetchApi } from '../services/api';

export function Consumer({
  device,
  roomId,
  producerId,
}: {
  device: types.Device;
  roomId: string;
  producerId: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [log, setLog] = useState('');

  const subscribe = useMemo(() => {
    async function consume(transport: types.Transport) {
      const { rtpCapabilities } = device;
      const { id, kind, rtpParameters } = await fetchApi({
        path: `/api/peers/${transport.id}/consume`,
        method: 'POST',
        data: { rtpCapabilities, producerId },
      });

      const consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });
      const stream = new MediaStream();
      stream.addTrack(consumer.track);
      return stream;
    }

    return async () => {
      const data = await fetchApi({
        path: `/api/rooms/${roomId}/consumer_peers`,
        method: 'POST',
        data: {
          forceTcp: false,
          rtpCapabilities: device.rtpCapabilities,
        },
      });

      const transport = device.createRecvTransport(data);

      transport.on('connect', ({ dtlsParameters }, callback, errback) => {
        fetchApi({
          path: `/api/peers/${data.id}/connect`,
          method: 'POST',
          data: { dtlsParameters },
        })
          .then(callback)
          .catch(errback);
      });

      transport.on('connectionstatechange', async (state) => {
        switch (state) {
          case 'connecting':
            setLog('subscribing...');
            break;

          case 'connected':
            if (ref.current) {
              ref.current.srcObject = await stream;
            }
            setLog('subscribed');
            break;

          case 'failed':
            transport.close();
            setLog('failed');
            break;

          default:
            break;
        }
      });

      const stream = consume(transport);
    };
  }, [device, producerId, roomId]);

  useEffect(() => {
    subscribe();
  }, [subscribe]);

  return (
    <div className="flex flex-col">
      <video ref={ref} controls autoPlay playsInline></video>
      <div className="pt-4">{log}</div>
    </div>
  );
}

export function Consumers({
  device,
  roomId,
}: {
  device: types.Device;
  roomId: string;
}) {
  const [items, setItems] = useState<Array<any>>([]);

  const load = useMemo(() => {
    return () => {
      fetchApi({
        path: `/api/rooms/${roomId}/producer_peers`,
        method: 'GET',
      }).then((data) => {
        setItems(data);
      });
    };
  }, [roomId]);

  useEffect(() => load(), [load]);

  return (
    <div className="flex flex-col">
      <button
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-slate-50 ring-blue-500"
        onClick={() => load()}
      >
        Refresh
      </button>
      {items.map((item) => (
        <div key={item.id} className="mt-4">
          <Consumer
            device={device}
            roomId={roomId}
            producerId={item.producerId}
          />
        </div>
      ))}
    </div>
  );
}
