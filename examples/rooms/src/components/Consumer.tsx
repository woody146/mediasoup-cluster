import { types } from 'mediasoup-client';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ClientRoom, fetchApi, MultiStreamsMixer } from '../services';
import { Recorder } from './Recorder';

export function Consumer({
  producers,
  room,
  onSuccess,
}: {
  room: ClientRoom;
  producers: Record<string, any>;
  onSuccess: (consumer: types.Consumer) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stream = useMemo(() => {
    return new MediaStream();
  }, []);

  const subscribe = async (producerId: string) => {
    const { rtpCapabilities } = room.device;
    const { id, kind, rtpParameters } = await fetchApi({
      path: `/api/consumer_peers/${room.recvTransport?.id}/consume`,
      method: 'POST',
      data: { rtpCapabilities, producerId },
    });

    const consumer = await room.consume({
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
      path: `/api/consumer_peers/${room.recvTransport?.id}/resume`,
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
  room,
  routerId,
  userId,
}: {
  room: ClientRoom;
  routerId: string;
  userId: string;
}) {
  const [items, setItems] = useState<Array<any>>([]);
  const [log, setLog] = useState('');
  const [transport, setTransport] = useState<types.Transport>();

  const streamsMixer = useMemo(() => new MultiStreamsMixer([]), []);

  const initRecvTransport = async () => {
    const data = await fetchApi({
      path: `/api/router/${routerId}/consumer_peers`,
      method: 'POST',
      data: { userId: userId },
    });
    const transport = room.initRecvTransport(data, {
      onConnect: (params) =>
        fetchApi({
          path: `/api/consumer_peers/${data.id}/connect`,
          method: 'POST',
          data: params,
        }),
      onConnecting: () => setLog('subscribing...'),
      onFailed: () => setLog('failed'),
      onConnected: () => setLog('connected'),
    });
    setTransport(transport);
  };

  const loadproducers = async () => {
    const itemsResult = await fetchApi({
      path: `/api/rooms/${room.roomId}/producer_peers`,
      method: 'GET',
    });
    setItems(itemsResult);
  };

  useEffect(() => {
    loadproducers();
    initRecvTransport();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Recorder stream={streamsMixer.getMixedStream()} type="audio" />
      <button
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-slate-50 ring-blue-500"
        onClick={() => loadproducers()}
      >
        Refresh
      </button>
      <div className="pt-4">{log}</div>
      {transport &&
        items.map((item) => (
          <div key={item.id} className="mt-4">
            <Consumer
              room={room}
              producers={item.producers}
              onSuccess={(consumer) => {
                if (consumer.kind === 'audio') {
                  const stream = new MediaStream();
                  stream.addTrack(consumer.track);
                  streamsMixer.appendStreams([stream]);
                }
              }}
            />
          </div>
        ))}
    </div>
  );
}
