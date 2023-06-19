'use client';
import { Device, types } from 'mediasoup-client';
import { useEffect, useState } from 'react';
import {
  Consumers,
  CreateRoom,
  DeleteRoom,
  ExitRoom,
  JoinRoom,
  Producer,
} from '../components';

export default function Home() {
  const [roomId, setRoomId] = useState<string>();
  const [routerId, setRouterId] = useState<string>();
  const [device, setDevice] = useState<types.Device>();
  const [user, setUser] = useState('');

  useEffect(() => {
    setUser('u' + Math.random().toString().slice(2, 6));
  }, []);

  const updateDevice = async (data: any) => {
    const newDevice = new Device();
    await newDevice.load({
      routerRtpCapabilities: data.rtpCapabilities,
    });
    setDevice(newDevice);
    setRoomId(data.roomId);
    setRouterId(data.routerId);
  };

  return (
    <div className="text-center p-8">
      {device && roomId && routerId ? (
        <div>
          <h3 className="my-4">
            <ExitRoom
              roomId={roomId}
              userId={user}
              onSuccess={() => {
                setDevice(undefined);
                setRoomId(undefined);
              }}
            />
            <b className="ml-4">Room Id</b> {roomId} <b>User id</b> {user}
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <div />
            <Producer device={device} roomId={roomId} userId={user} />
            <div />
            <Consumers
              device={device}
              roomId={roomId}
              routerId={routerId}
              userId={user}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-8">
          <CreateRoom onSuccess={updateDevice} />
          <JoinRoom onSuccess={updateDevice} />
          <DeleteRoom />
        </div>
      )}
    </div>
  );
}
