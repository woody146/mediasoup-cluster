import { constants } from '../constants.js';
import { MediaSlave } from '../entities/index.js';
import { BaseService } from './base.js';

export class SlaveService extends BaseService {
  async add(data: {
    internalHost: string;
    for: string; // consumer | producer
    apiPort: number;
    maxPeer?: number;
  }) {
    const mediasoupSlave = new MediaSlave();
    if (![constants.CONSUMER, constants.PRODUCER].includes(data.for)) {
      throw new Error('Invalid for param');
    }
    Object.assign(mediasoupSlave, data);
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(MediaSlave)
      .values([{ ...data, peerCount: 0 }])
      .orUpdate(['for', 'maxPeer', 'peerCount'], ['internalHost', 'apiPort'])
      .execute();
    return {};
  }

  getCurrent() {
    return this.dataSource.getRepository(MediaSlave).findOne({
      where: {
        internalHost: process.env.SLAVE_INTERNAL_HOST || 'localhost',
        apiPort: Number(process.env.PORT || 80),
      },
    });
  }

  removeCurrent() {
    return this.dataSource
      .createQueryBuilder(MediaSlave, 'MediaSlave')
      .delete()
      .where('internalHost = :internalHost', {
        internalHost: process.env.SLAVE_INTERNAL_HOST || 'localhost',
      })
      .andWhere('apiPort = :apiPort', {
        apiPort: Number(process.env.PORT || 80),
      })
      .execute();
  }

  addFromEnv() {
    return this.add({
      internalHost: process.env.SLAVE_INTERNAL_HOST || 'localhost',
      for: process.env.SLAVE_FOR || constants.CONSUMER,
      apiPort: Number(process.env.PORT || 80),
      maxPeer: Number(process.env.SLAVE_MAX_PEER),
    });
  }

  getForNewRoom() {
    return this.dataSource
      .createQueryBuilder()
      .select('slave')
      .from(MediaSlave, 'slave')
      .where('slave.for = :for', { for: constants.PRODUCER })
      .andWhere('slave.peerCount < slave.maxPeer')
      .getOne();
  }
}
