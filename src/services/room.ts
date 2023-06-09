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
      const mediasoupRoom = new MediaRoom();
      mediasoupRoom.routerId = result.id;
      mediasoupRoom.slaveId = slave.id;
      Object.assign(mediasoupRoom, data);
      await this.dataSource.getRepository(MediaRoom).save(mediasoupRoom);
      return mediasoupRoom.id;
    }
    throw new ServiceError(404, 'Slave not found');
  }

  async get(data: { id: string }) {
    return this.dataSource
      .getRepository(MediaRoom)
      .findOne({ where: { id: data.id } });
  }
}
