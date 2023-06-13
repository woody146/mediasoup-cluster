'use client';
import { Device, types } from 'mediasoup-client';
import { useState } from 'react';
import { Consumers, CreateRoom, JoinRoom, Producer } from '../components';

export default function Home() {
  const [roomId, setRoomId] = useState<string>();
  const [device, setDevice] = useState<types.Device>();

  const updateDevice = async (data: any) => {
    const newDevice = new Device();
    await newDevice.load({
      routerRtpCapabilities: data.rtpCapabilities,
    });
    setDevice(newDevice);
    setRoomId(data.id);
  };

  return (
    <div className="text-center p-8">
      {device && roomId ? (
        <div>
          <h3 className="my-4">
            <b>Room Id</b> {roomId}
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <div />
            <Producer device={device} roomId={roomId} />
            <div />
            <Consumers device={device} roomId={roomId} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center space-x-8">
          <CreateRoom onSuccess={updateDevice} />
          <JoinRoom onSuccess={updateDevice} />
        </div>
      )}
    </div>
  );
}
