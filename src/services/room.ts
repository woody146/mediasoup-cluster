import { constants } from '../constants.js';
import { MediaRoom } from '../entities/index.js';
import { fetchApi } from '../utils/index.js';
import { ServiceError, BaseService } from './base.js';
import { SlaveService } from './slave.js';

export class RoomService extends BaseService {
  async create(data: { metadata?: any }) {
    const slave = await this.createService(SlaveService).getFor(
      constants.PRODUCER
    );
    if (slave) {
      const result = await fetchApi({
        host: slave.internalHost,
        port: slave.apiPort,
        path: '/routers',
        method: 'POST',
      });
      const mediaRoom = new MediaRoom();
      mediaRoom.routerId = result.id;
      mediaRoom.slaveId = slave.id;
      Object.assign(mediaRoom, data);
      await this.dataSource.getRepository(MediaRoom).save(mediaRoom);
      return { ...result, id: mediaRoom.id };
    }
    throw new ServiceError(404, 'Slave not found');
  }

  async get(data: { roomId: string }) {
    return this.dataSource.getRepository(MediaRoom).findOne({
      relations: { slave: true },
      where: { id: data.roomId },
    });
  }

  async getCapabilities(data: { roomId: string }) {
    const room = await this.get(data);
    if (room) {
      const result = await fetchApi({
        host: room.slave.internalHost,
        port: room.slave.apiPort,
        path: '/routers/:routerId',
        method: 'GET',
        data: { routerId: room.routerId },
      });
      return { ...result, id: data.roomId };
    }
    throw new ServiceError(404, 'Room not found');
  }
}
