import { types } from 'mediasoup-client';
import { ClientRoom, MultiStreamsMixer } from 'mediasoup-client-utils';
import { useEffect, useMemo, useRef, useState } from 'react';

import { fetchApi } from '../services';
import { Recorder } from './Recorder';

export function Consumer({
  producers,
  room,
  display = true,
  onSuccess,
}: {
  room: ClientRoom;
  producers: Record<string, any>;
  display?: boolean;
  onSuccess?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stream = useMemo(() => {
    return new MediaStream();
  }, []);

  const subscribe = async (producerId: string) => {
    const { rtpCapabilities } = room.device;
    const { id, kind, rtpParameters } = await fetchApi({
      path: `/api/consumer_transports/${room.recvTransport?.id}/consume`,
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
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    } else {
      const element = document.createElement('video');
      element.srcObject = stream;
    }
    await fetchApi({
      path: `/api/consumers/${id}/resume`,
      method: 'POST',
    });
  };

  async function init() {
    await Promise.all(producers.map((item: any) => subscribe(item.id)));
    onSuccess && onSuccess();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    display && (
      <div className="flex flex-col gap-4">
        <video ref={videoRef} controls autoPlay playsInline />
      </div>
    )
  );
}

export function Consumers({
  room,
  userId,
  display = true,
  onSuccess,
}: {
  room: ClientRoom;
  userId: string;
  display?: boolean;
  onSuccess?: () => void;
}) {
  const [items, setItems] = useState<Array<any>>([]);
  const [log, setLog] = useState('');
  const [transport, setTransport] = useState<types.Transport>();
  const [success, setSuccess] = useState<Record<string, boolean>>({});

  const streamsMixer = useMemo(() => new MultiStreamsMixer([]), []);

  const initRecvTransport = async () => {
    const data = await fetchApi({
      path: `/api/router/${room.routerId}/consumer_transports`,
      method: 'POST',
      data: { userId: userId },
    });
    const transport = room.initRecvTransport(data, {
      onConnect: (params) =>
        fetchApi({
          path: `/api/consumer_transports/${data.id}/connect`,
          method: 'POST',
          data: params,
        }),
      onConnecting: () => setLog('subscribing...'),
      onFailed: () => setLog('failed'),
      onConnected: () => setLog('connected'),
    });
    setTransport(transport);
    if (!display) {
      // auto get producers for consumer cloner
      loadProducers();
    }
  };

  const loadProducers = async () => {
    const result = await fetchApi({
      path: `/api/rooms/${room.roomId}/producer_transports`,
      method: 'GET',
    });
    setItems(result.items);
    setSuccess((oldSuccess) => {
      const newSuccess: Record<string, boolean> = {};
      result.items.map((item: any) => {
        if (oldSuccess[item.id]) {
          newSuccess[item.id] = oldSuccess[item.id];
        } else {
          newSuccess[item.id] = false;
        }
      });
      return newSuccess;
    });
  };

  useEffect(() => {
    initRecvTransport();
    room.onNewConsumer.push((consumer) => {
      if (consumer.kind === 'audio') {
        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        streamsMixer.appendStreams([stream]);
      }
    });
  }, []);

  useEffect(() => {
    if (Object.keys(success).length > 0) {
      const item = Object.values(success).find((item) => item === false);
      if (item === undefined) {
        onSuccess && onSuccess();
      }
    }
  }, [success]);

  return (
    <div className="flex flex-col gap-4">
      <Recorder stream={streamsMixer.getMixedStream()} type="audio" />
      <button
        className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-md shadow-sm border-2 border-blue-500"
        onClick={() => loadProducers()}
      >
        Get producers
      </button>
      <div className="pt-4">{log}</div>
      {transport &&
        items.map((item) => (
          <div key={item.id} className="mt-4">
            <Consumer
              room={room}
              producers={item.producers}
              display={display}
              onSuccess={() =>
                setSuccess((oldValue) => {
                  const newValue = { ...oldValue };
                  newValue[item.id] = true;
                  return newValue;
                })
              }
            />
          </div>
        ))}
    </div>
  );
}
