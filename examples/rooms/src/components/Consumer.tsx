import { types } from 'mediasoup-client';
import { useEffect, useMemo, useRef, useState } from 'react';

import { fetchApi, MultiStreamsMixer } from '../services';
import { Recorder } from './Recorder';

export function Consumer({
  device,
  producers,
  transport,
  onSuccess,
}: {
  device: types.Device;
  producers: Record<string, any>;
  transport: types.Transport;
  onSuccess: (consumer: types.Consumer) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stream = useMemo(() => {
    return new MediaStream();
  }, []);

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

    stream.addTrack(consumer.track);
    onSuccess(consumer);
    if (videoRef.current) {
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

  const [streams, setStreams] = useState<Array<MediaStream>>([]);
  const [streamsMixer, setStreamsMixer] = useState<MultiStreamsMixer>();

  const appendStream = useMemo(() => {
    return (aStreams: Array<MediaStream>) => {
      if (streamsMixer) {
        streamsMixer.appendStreams(aStreams);
        return true;
      }
      return false;
    };
  }, [streamsMixer]);

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
    <div className="flex flex-col gap-4">
      {streamsMixer ? (
        <Recorder stream={streamsMixer.getMixedStream()} type="audio" />
      ) : (
        <button
          className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-slate-50 ring-blue-500"
          onClick={() => {
            const s = new MultiStreamsMixer(streams);
            setStreamsMixer(s);
          }}
        >
          Start
        </button>
      )}
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
              onSuccess={(consumer) => {
                if (consumer.kind === 'audio') {
                  const stream = new MediaStream();
                  stream.addTrack(consumer.track);
                  if (!appendStream([stream])) {
                    setStreams([...streams, stream]);
                  }
                }
              }}
            />
          </div>
        ))}
    </div>
  );
}
