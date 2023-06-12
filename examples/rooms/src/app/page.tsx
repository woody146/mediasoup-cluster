'use client';
import { Device, types } from 'mediasoup-client';
import { useState } from 'react';
import { CreateRoom } from '../components';

export default function Home() {
  const [device, setDevice] = useState<types.Device>();
  return (
    <div className="text-center py-8">
      {device ? (
        JSON.stringify(device)
      ) : (
        <CreateRoom
          onSuccess={async (data) => {
            const newDevice = new Device();
            await newDevice.load({
              routerRtpCapabilities: data.rtpCapabilities,
            });
            setDevice(newDevice);
          }}
        />
      )}
    </div>
  );
}
