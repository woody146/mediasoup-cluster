import { types } from 'mediasoup-client';
import { fetchApi } from '../services';
import { useRef, useState } from 'react';

export function Producer({
  device,
  roomId,
}: {
  device: types.Device;
  roomId: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [log, setLog] = useState('');

  const produce = async () => {
    let stream: any;

    const data = await fetchApi({
      path: `/api/rooms/${roomId}/producer_peers`,
      method: 'POST',
      data: {
        forceTcp: false,
        rtpCapabilities: device.rtpCapabilities,
      },
    });

    const transport = device.createSendTransport(data);
    transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      fetchApi({
        path: `/api/peers/${data.id}/connect`,
        method: 'POST',
        data: { dtlsParameters },
      })
        .then(callback)
        .catch(errback);
    });

    transport.on(
      'produce',
      async ({ kind, rtpParameters }, callback, errback) => {
        try {
          const { id } = await fetchApi({
            path: `/api/peers/${data.id}/produce`,
            method: 'POST',
            data: {
              transportId: transport.id,
              kind,
              rtpParameters,
            },
          });
          callback({ id });
        } catch (err: any) {
          errback(err);
        }
      }
    );

    transport.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connecting':
          setLog('publishing...');
          break;

        case 'connected':
          if (ref.current) {
            ref.current.srcObject = stream;
          }
          setLog('published');
          break;

        case 'failed':
          transport.close();
          setLog('failed');
          break;

        default:
          break;
      }
    });

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const params = { track };

      await transport.produce(params);
    } catch (err: any) {
      setLog(err.toString());
    }
  };

  return (
    <div className="flex flex-col">
      <video ref={ref} controls autoPlay playsInline></video>
      <div className="pt-4">{log}</div>
      <div className="pt-4">
        <button
          className="px-4 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm ring-2 ring-offset-2 ring-offset-slate-50 ring-blue-500"
          onClick={() => produce()}
        >
          Produce
        </button>
      </div>
    </div>
  );
}
