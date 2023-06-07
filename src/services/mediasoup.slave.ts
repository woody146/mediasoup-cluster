import { constants } from '../constants.js';
import { MediasoupSlave } from '../entities/index.js';
import { BaseService } from './base.js';

export class MediasoupSlaveService extends BaseService {
  add(data: {
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
    return this.dataSource.getRepository(MediasoupSlave).save(mediasoupSlave);
  }
}
