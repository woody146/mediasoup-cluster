import { constants } from '../constants.js';
import { MediasoupSlave } from '../entities/index.js';
import { BaseService } from './base.js';

export class SlaveService extends BaseService {
  async add(data: {
    internalHost: string;
    externalHost: string;
    for: string; // consumer | producer
    apiPort: number;
    maxPeer?: number;
  }) {
    const mediasoupSlave = new MediasoupSlave();
    if (![constants.CONSUMER, constants.PRODUCER].includes(data.for)) {
      throw new Error('Invalid for param');
    }
    Object.assign(mediasoupSlave, data);
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(MediasoupSlave)
      .values([{ ...data, peerCount: 0 }])
      .orUpdate(
        ['externalHost', 'for', 'maxPeer', 'peerCount'],
        ['internalHost', 'apiPort']
      )
      .execute();
    return {};
  }

  async getCurrent() {
    return this.dataSource.getRepository(MediasoupSlave).findOne({
      where: {
        internalHost: process.env.SLAVE_INTERNAL_HOST || 'localhost',
        apiPort: Number(process.env.PORT || 80),
      },
    });
  }

  addFromEnv() {
    return this.add({
      internalHost: process.env.SLAVE_INTERNAL_HOST || 'localhost',
      externalHost: process.env.SLAVE_EXTERNAL_HOST || 'localhost',
      for: process.env.SLAVE_FOR || constants.CONSUMER,
      apiPort: Number(process.env.PORT || 80),
      maxPeer: Number(process.env.SLAVE_MAX_PEER),
    });
  }

  async getForNewRoom() {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('slave')
      .from(MediasoupSlave, 'slave')
      .where('slave.for = :for', { for: constants.PRODUCER })
      .andWhere('slave.peerCount < slave.maxPeer')
      .getOne();

    return result;
  }
}
