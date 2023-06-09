import { constants } from '../constants.js';
import { MediaPeer } from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService, ServiceError } from './base.js';
import { RoomService } from './room.js';

export class PeerService extends BaseService {
  async createProducer(data: { roomId: string; metadata?: any }) {
    const room = await this.createService(RoomService).get({ id: data.roomId });
    if (room) {
      const result = await fetchApi({
        host: room.slave.externalHost,
        port: room.slave.apiPort,
        path: '/routers/:routerId/producer_transports',
        method: 'POST',
        data: { routerId: room.routerId },
      });
      const mediaPeer = new MediaPeer();
      mediaPeer.id = result.id;
      mediaPeer.routerId = room.routerId;
      mediaPeer.slaveId = room.slave.id;
      mediaPeer.type = constants.PRODUCER;
      mediaPeer.roomId = room.id;

      await this.dataSource.getRepository(MediaPeer).save(mediaPeer);
      return result;
    }
    throw new ServiceError(404, 'Room not found');
  }
}
