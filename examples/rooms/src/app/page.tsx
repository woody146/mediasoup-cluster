'use client';
import { ClientRoom } from 'mediasoup-client-utils';
import { useMemo, useState } from 'react';
import {
  Consumers,
  ConsumerCloner,
  CreateRoom,
  DeleteRoom,
  ExitRoom,
  JoinRoom,
  Producer,
  ProducerCloner,
} from '../components';

export default function Home() {
  const [room, setRoom] = useState<ClientRoom>();
  const user = useMemo(() => 'u' + Math.random().toString().slice(2, 6), []);

  const updateDevice = async (data: any) => {
    const clientRoom = new ClientRoom(data.roomId, data.routerId);
    await clientRoom.initDevice({
      routerRtpCapabilities: data.rtpCapabilities,
    });
    setRoom(clientRoom);
  };

  return (
    <div className="text-center p-8">
      {room ? (
        <div>
          <h3 className="my-4">
            <ExitRoom
              roomId={room.roomId}
              userId={user}
              onSuccess={() => {
                setRoom(undefined);
              }}
            />
            <b className="ml-4">Room Id</b> {room.roomId} <b>User id</b> {user}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div />
            <div>
              <h4 className="text-xl m-4">Clone producer</h4>
              <ProducerCloner room={room} userId={user} />
              <h4 className="text-xl m-4">Simple producer</h4>
              <Producer room={room} userId={user} />
            </div>
            <div />
            <div>
              <h4 className="text-xl m-4">Clone consumer</h4>
              <ConsumerCloner roomId={room.roomId} userId={user} />
              {/* <h4 className="text-xl m-4">Hide consumer</h4>
              <Consumers room={room} userId={user} display={false} /> */}
              <h4 className="text-xl m-4">Simple consumer</h4>
              <Consumers room={room} userId={user} display={true} />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div />
          <div className="flex flex-col space-y-8">
            <CreateRoom onSuccess={updateDevice} />
            <JoinRoom onSuccess={updateDevice} />
            <DeleteRoom />
          </div>
        </div>
      )}
    </div>
  );
}
