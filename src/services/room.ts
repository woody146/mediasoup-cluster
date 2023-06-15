import { constants } from '../constants.js';
import { MediaRoom } from '../entities/index.js';
import { fetchApi } from '../utils/index.js';
import { ServiceError, BaseService } from './base.js';
import { WorkerService } from './worker.js';

export class RoomService extends BaseService {
  async create(data: { metadata?: any }) {
    const worker = await this.createService(WorkerService).getFor(
      constants.PRODUCER
    );
    if (worker) {
      const result = await fetchApi({
        host: worker.internalHost,
        port: worker.apiPort,
        path: '/routers',
        method: 'POST',
        data: { pid: worker.pid },
      });
      const mediaRoom = new MediaRoom();
      mediaRoom.routerId = result.id;
      mediaRoom.workerId = worker.id;
      Object.assign(mediaRoom, data);
      await this.dataSource.getRepository(MediaRoom).save(mediaRoom);
      return { ...result, id: mediaRoom.id };
    }
  }

  async get(data: { roomId: string }) {
    const room = await this.dataSource.getRepository(MediaRoom).findOne({
      relations: { worker: true },
      where: { id: data.roomId },
    });
    if (room) {
      return room;
    }
    throw new ServiceError(404, 'Room not found');
  }

  async getCapabilities(data: { roomId: string }) {
    const room = await this.get(data);
    const result = await fetchApi({
      host: room.worker.internalHost,
      port: room.worker.apiPort,
      path: '/routers/:routerId',
      method: 'GET',
      data: { routerId: room.routerId },
    });
    return { ...result, id: data.roomId };
  }
}
