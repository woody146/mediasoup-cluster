import { MediaRoom } from '../entities/index.js';
import { fetchApi } from '../utils/index.js';
import { ServiceError, BaseService } from './base.js';
import { SlaveService } from './slave.js';

export class RoomService extends BaseService {
  // for master server
  async create(data: { metadata?: any }) {
    const slave = await this.createService(SlaveService).getForNewRoom();
    if (slave) {
      const result = await fetchApi({
        host: slave.externalHost,
        port: slave.apiPort,
        path: '/routers',
        method: 'POST',
      });
      const mediaRoom = new MediaRoom();
      mediaRoom.routerId = result.id;
      mediaRoom.slaveId = slave.id;
      Object.assign(mediaRoom, data);
      await this.dataSource.getRepository(MediaRoom).save(mediaRoom);
      return { id: mediaRoom.id };
    }
    throw new ServiceError(404, 'Slave not found');
  }

  async get(data: { roomId: string }) {
    return this.dataSource.getRepository(MediaRoom).findOne({
      relations: { slave: true },
      where: { id: data.roomId },
    });
  }
}
