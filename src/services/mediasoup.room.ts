import { MediasoupRoom } from '../entities/index.js';
import { fetchApi } from '../utils/index.js';
import { BaseService } from './base.js';
import { MediasoupSlaveService } from './mediasoup.slave.js';

// for master server

export class MediasoupRoomService extends BaseService {
  async create(data: { metadata?: any }) {
    const slave = await this.createService(
      MediasoupSlaveService
    ).getForNewRoom();
    if (slave) {
      const result = await fetchApi({
        host: slave.externalHost,
        port: slave.apiPort,
        path: '/routers',
        method: 'POST',
      });
      const mediasoupRoom = new MediasoupRoom();
      mediasoupRoom.routerId = result.id;
      mediasoupRoom.slaveId = slave.id;
      Object.assign(mediasoupRoom, data);
      await this.dataSource.getRepository(MediasoupRoom).save(mediasoupRoom);
      return mediasoupRoom.id;
    }
    throw { code: 451, message: 'Slave not found' };
  }
}
