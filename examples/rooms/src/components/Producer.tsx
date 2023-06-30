import { ClientRoom } from 'mediasoup-client-utils';
import { fetchApi } from '../services';
import { useRef, useState } from 'react';

export function Producer({
  room,
  userId,
}: {
  room: ClientRoom;
  userId: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [log, setLog] = useState('');
  const [success, setSuccess] = useState(false);
  const [useVideo, setuseVideo] = useState(false);
  const [useAudio, setUseAudio] = useState(false);

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
        setLog('published');
      },
    });

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: useVideo,
        audio: useAudio,
      });
      if (useVideo) {
        await transport.produce({ track: stream.getVideoTracks()[0] });
      }
      if (useAudio) {
        await transport.produce({ track: stream.getAudioTracks()[0] });
      }
    } catch (err: any) {
      setLog(err.toString());
      throw err;
    }
  };

  return (
    <div className="flex flex-col">
      <video ref={ref} controls autoPlay playsInline></video>
      <div className="pt-4">{log}</div>
      <div className="pt-4 flex justify-center content-center space-x-4">
        <div>
          <input
            id="useVideo"
            type="checkbox"
            disabled={success}
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
            disabled={success}
            checked={useAudio}
            onChange={() => setUseAudio(!useAudio)}
            className="default:ring-2 mr-2"
          />
          <label htmlFor="useAudio">Audio</label>
        </div>
        <button
          className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-slate-50 ring-blue-500 disabled:opacity-50"
          disabled={success}
          onClick={() =>
            produce().then(() => {
              setSuccess(true);
            })
          }
        >
          Produce
        </button>
      </div>
    </div>
  );
}
