import { types } from 'mediasoup-client';
import { useEffect, useMemo, useRef, useState } from 'react';

import { fetchApi } from '../services/api';

export function Consumer({
  device,
  producerId,
  transport,
}: {
  device: types.Device;
  producerId: string;
  transport: types.Transport;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  const subscribe = useMemo(() => {
    return async () => {
      const { rtpCapabilities } = device;
      const { id, kind, rtpParameters } = await fetchApi({
        path: `/api/consumer_peers/${transport.id}/consume`,
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

      if (ref.current) {
        ref.current.srcObject = stream;
        fetchApi({
          path: `/api/consumer_peers/${transport.id}/resume`,
          method: 'POST',
          data: { consumerId: id },
        });
      }
    };
  }, [device, producerId, transport]);

  useEffect(() => {
    subscribe();
  }, [subscribe]);

  return (
    <div className="flex flex-col">
      <video ref={ref} controls autoPlay playsInline></video>
    </div>
  );
}

export function Consumers({
  device,
  roomId,
  userId,
}: {
  device: types.Device;
  roomId: string;
  userId: string;
}) {
  const [items, setItems] = useState<Array<any>>([]);
  const [log, setLog] = useState('');
  const [transport, setTransport] = useState<types.Transport>();
  const [connected, setConnected] = useState(false);

  const load = async () => {
    const itemsResult = await fetchApi({
      path: `/api/rooms/${roomId}/producer_peers`,
      method: 'GET',
    });
    setItems(itemsResult);

    if (!transport) {
      const routerData = await fetchApi({
        path: `/api/rooms/${roomId}/consumer_routers`,
        method: 'POST',
      });
      const data = await fetchApi({
        path: `/api/router/${routerData.id}/consumer_peers`,
        method: 'POST',
        data: { userId: userId },
      });
      const newTransport = device.createRecvTransport(data);
      newTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
        fetchApi({
          path: `/api/consumer_peers/${data.id}/connect`,
          method: 'POST',
          data: { dtlsParameters },
        })
          .then(callback)
          .catch(errback);
      });
      newTransport.on('connectionstatechange', async (state) => {
        switch (state) {
          case 'connecting':
            setLog('subscribing...');
            break;

          case 'connected':
            setLog('subscribed');
            setConnected(true);
            break;

          case 'failed':
            newTransport.close();
            setLog('failed');
            break;

          default:
            break;
        }
      });
      setTransport(newTransport);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col">
      <button
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-slate-50 ring-blue-500"
        onClick={() => load()}
      >
        Refresh
      </button>
      <div className="pt-4">{log}</div>
      {transport &&
        // must init transport with first producer, then it can consume many producers
        items.slice(0, connected ? items.length : 1).map((item) => (
          <div key={item.id} className="mt-4">
            <Consumer
              device={device}
              transport={transport}
              producerId={item.producerId}
            />
          </div>
        ))}
    </div>
  );
}
