import { constants } from '../constants.js';
import { MediaRouter } from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService, ServiceError } from './base.js';
import { SlaveService } from './slave.js';

export class RouterService extends BaseService {
  async create(data: { roomId: string }) {
    const slave = await this.createService(SlaveService).getFor(
      constants.CONSUMER
    );
    if (slave) {
      const result = await fetchApi({
        host: slave.internalHost,
        port: slave.apiPort,
        path: '/routers',
        method: 'POST',
      });
      const mediaRouter = new MediaRouter();
      mediaRouter.id = result.id;
      mediaRouter.slaveId = slave.id;
      Object.assign(mediaRouter, data);
      await this.dataSource.getRepository(MediaRouter).save(mediaRouter);
      return { result };
    }
    throw new ServiceError(404, 'Slave not found');
  }

  async get(data: { roomId: string }) {
    const router = await this.dataSource
      .createQueryBuilder(MediaRouter, 'router')
      .leftJoinAndSelect('router.slave', 'slave')
      .where('router.roomId = :roomId', { roomId: data.roomId })
      .andWhere('slave.peerCount < slave.maxPeer')
      .getOne();
    if (router) {
      const result = await fetchApi({
        host: router.slave.internalHost,
        port: router.slave.apiPort,
        path: '/routers/:routerId',
        method: 'GET',
        data: { routerId: router.id },
      });
      return { ...result, id: data.roomId };
    }
    return null;
  }

  async getOrCreate(data: { roomId: string }) {
    const result = await this.get(data);
    if (result) {
      return result;
    }
    return this.create(data);
  }
}
