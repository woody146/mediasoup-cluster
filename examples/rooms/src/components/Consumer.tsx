import { types } from 'mediasoup-client';
import { useEffect, useRef, useState } from 'react';

import { fetchApi } from '../services/api';
import { Record } from './Record';

export function Consumer({
  device,
  producers,
  transport,
}: {
  device: types.Device;
  producers: Record<string, any>;
  transport: types.Transport;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLVideoElement>(null);

  const subscribe = async (producerId: string) => {
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

    if (audioRef.current && kind === 'audio') {
      audioRef.current.srcObject = stream;
    } else if (videoRef.current && kind === 'video') {
      videoRef.current.srcObject = stream;
    }
    await fetchApi({
      path: `/api/consumer_peers/${transport.id}/resume`,
      method: 'POST',
      data: { consumerId: id },
    });
  };

  useEffect(() => {
    producers.map((item: any) => subscribe(item.id));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <video ref={videoRef} controls autoPlay playsInline />
      <audio ref={audioRef} controls autoPlay playsInline />
      <div className="flex gap-4">
        {videoRef.current && (
          <Record stream={videoRef.current.srcObject as any} type="video" />
        )}
        {audioRef.current && (
          <Record stream={audioRef.current.srcObject as any} type="audio" />
        )}
      </div>
    </div>
  );
}

export function Consumers({
  device,
  roomId,
  routerId,
  userId,
}: {
  device: types.Device;
  roomId: string;
  routerId: string;
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
      const data = await fetchApi({
        path: `/api/router/${routerId}/consumer_peers`,
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
              producers={item.producers}
            />
          </div>
        ))}
    </div>
  );
}
