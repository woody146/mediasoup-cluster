import { MediasoupRoom } from '../entities/index.js';
import { BaseService } from './base.js';
import { MediasoupSlaveService } from './mediasoup.slave.js';

export class MediasoupRoomService extends BaseService {
  async create(data: { metadata?: any }) {
    const slave = await this.createService(
      MediasoupSlaveService
    ).getForNewRoom();
    if (slave) {
      const mediasoupRoom = new MediasoupRoom();
      Object.assign(mediasoupRoom, data);
      await this.dataSource.getRepository(MediasoupRoom).save(mediasoupRoom);
      return mediasoupRoom.id;
    }
    throw { code: 451, message: 'Slave not found' };
  }
}
