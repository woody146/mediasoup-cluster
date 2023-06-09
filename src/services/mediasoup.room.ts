import { MediasoupRoom } from '../entities/index.js';
import { fetchApi } from '../utils/index.js';
import { ServiceError, BaseService } from './base.js';
import { MediasoupSlaveService } from './mediasoup.slave.js';

export class MediasoupRoomService extends BaseService {
  // for master server
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
    throw new ServiceError(404, 'Slave not found');
  }

  /**
   * Remove all rooms of current slave
   */
  async removeAll() {
    const slave = await this.createService(MediasoupSlaveService).getCurrent();
    if (slave) {
      await this.dataSource
        .createQueryBuilder(MediasoupRoom, 'MediasoupRoom')
        .delete()
        .where('slaveId = :slaveId', { slaveId: slave.id })
        .execute();
    }
  }
}
