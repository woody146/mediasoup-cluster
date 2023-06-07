import { constants } from '../constants';
import { MediasoupSlave } from '../entities';
import { BaseService } from './base';

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
