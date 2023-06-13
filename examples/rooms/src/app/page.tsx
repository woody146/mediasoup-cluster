'use client';
import { Device, types } from 'mediasoup-client';
import { useState } from 'react';
import { CreateRoom, Producer } from '../components';

export default function Home() {
  const [roomId, setRoomId] = useState<string>();
  const [device, setDevice] = useState<types.Device>();

  return (
    <div className="text-center p-8">
      {device && roomId ? (
        <div>
          <h3 className="my-4">{roomId}</h3>
          <div className="grid grid-cols-4 gap-4">
            <Producer device={device} roomId={roomId} />
          </div>
        </div>
      ) : (
        <CreateRoom
          onSuccess={async (data) => {
            const newDevice = new Device();
            await newDevice.load({
              routerRtpCapabilities: data.rtpCapabilities,
            });
            setDevice(newDevice);
            setRoomId(data.id);
          }}
        />
      )}
    </div>
  );
}
