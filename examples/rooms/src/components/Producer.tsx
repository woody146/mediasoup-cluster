import { types } from 'mediasoup-client';
import { ClientRoom } from 'mediasoup-client-utils';
import { useEffect, useRef, useState } from 'react';

import { fetchApi } from '../services';

const PauseProducer = ({
  producer,
  title,
}: {
  producer: types.Producer;
  title: string;
}) => {
  const [paused, setPaused] = useState(false);

  const action = async (action: 'pause' | 'resume') => {
    await fetchApi({
      path: `/api/producers/${producer.id}/${action}`,
      method: 'POST',
    });
    setPaused(action === 'pause' ? true : false);
  };

  return paused ? (
    <button
      className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-md shadow-sm border-2 border-blue-500"
      onClick={() => action('resume')}
    >
      Resume {title}
    </button>
  ) : (
    <button
      className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-md shadow-sm border-2 border-yellow-500"
      onClick={() => action('pause')}
    >
      Pause {title}
    </button>
  );
};

export function Producer({
  room,
  userId,
  autoProduce,
  onSuccess,
}: {
  room: ClientRoom;
  userId: string;
  autoProduce?: 'video' | 'audio';
  onSuccess?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [log, setLog] = useState('');
  const [useVideo, setuseVideo] = useState(autoProduce === 'video');
  const [useAudio, setUseAudio] = useState(autoProduce === 'audio');
  const [videoProducer, setVideoProducer] = useState<types.Producer>();
  const [audioProducer, setAudioProducer] = useState<types.Producer>();

  const produce = async () => {
    let stream: MediaStream;

    const data = await fetchApi({
      path: `/api/rooms/${room.roomId}/producer_transports`,
      method: 'POST',
      data: { userId: userId },
    });

    const transport = room.initSendTransport(data, {
      onConnect: (params) =>
        fetchApi({
          path: `/api/producer_transports/${data.id}/connect`,
          method: 'POST',
          data: params,
        }),
      onProduce: (params) =>
        fetchApi({
          path: `/api/producer_transports/${data.id}/produce`,
          method: 'POST',
          data: params,
        }),
      onConnecting: () => setLog('publishing...'),
      onFailed: () => setLog('failed'),
      onConnected: () => {
        if (ref.current) {
          ref.current.srcObject = stream;
        }
        onSuccess && onSuccess();
        setLog('published');
      },
    });

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: useVideo,
        audio: useAudio && {
          echoCancellation: true,
        },
      });
      if (useVideo) {
        const producer = await transport.produce({
          track: stream.getVideoTracks()[0],
        });
        setVideoProducer(producer);
      }
      if (useAudio) {
        const producer = await transport.produce({
          track: stream.getAudioTracks()[0],
        });
        setAudioProducer(producer);
      }
    } catch (err: any) {
      setLog(err.toString());
      throw err;
    }
  };

  useEffect(() => {
    if (autoProduce) {
      produce();
    }
  }, []);

  return (
    <div className="flex flex-col">
      <video ref={ref} controls autoPlay playsInline></video>
      <div className="pt-4">{log}</div>
      <div className="pt-4 flex justify-center space-x-4">
        {videoProducer && (
          <PauseProducer producer={videoProducer} title="video" />
        )}
        {audioProducer && (
          <PauseProducer producer={audioProducer} title="audio" />
        )}
        {!audioProducer && !videoProducer && (
          <>
            <div>
              <input
                id="useVideo"
                type="checkbox"
                checked={useVideo}
                onChange={() => setuseVideo(!useVideo)}
                className="default:ring-2 mr-2"
              />
              <label htmlFor="useVideo">Video</label>
            </div>
            <div>
              <input
                id="useAudio"
                type="checkbox"
                checked={useAudio}
                onChange={() => setUseAudio(!useAudio)}
                className="default:ring-2 mr-2"
              />
              <label htmlFor="useAudio">Audio</label>
            </div>
            <button
              className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border rounded-md shadow-sm border-2 border-blue-500 disabled:opacity-50"
              onClick={() => produce()}
            >
              Produce
            </button>
          </>
        )}
      </div>
    </div>
  );
}
