import { constants } from '../constants.js';
import { MediaRouter } from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService, ServiceError } from './base.js';
import { RoomService } from './room.js';
import { SlaveService } from './slave.js';

export class RouterService extends BaseService {
  async create(data: { roomId: string }) {
    const slave = await this.createService(SlaveService).getFor(
      constants.CONSUMER
    );
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

  checkToPipe(data: { routerId: string; producerId: string }) {
    return this.dataSource.transaction(async (entityManager) => {
      const router = await entityManager.getRepository(MediaRouter).findOne({
        lock: { mode: 'pessimistic_read' },
        relations: { slave: true },
        where: { id: data.routerId },
      });
      if (router && !router.pipedProducers.includes(data.producerId)) {
        const room = await this.createService(RoomService).get({
          roomId: router.roomId,
        });

        await fetchApi({
          host: router.slave.internalHost,
          port: router.slave.apiPort,
          path: '/routers/:routerId/destination_pipe_transports',
          method: 'POST',
          data: {
            routerId: data.routerId,
            sourceHost: room.slave.internalHost,
            sourcePort: room.slave.apiPort,
            sourceRouterId: room.routerId,
            sourceProducerId: data.producerId,
          },
        });

        router.pipedProducers.push(data.producerId);
        entityManager.save(router);
      }
    });
  }

  async getForRoom(data: { roomId: string }) {
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

  async get(data: { routerId: string }) {
    const router = await this.dataSource.getRepository(MediaRouter).findOne({
      relations: { slave: true },
      where: { id: data.routerId },
    });
    if (router) {
      return router;
    }
    throw new ServiceError(404, 'Router not found');
  }

  async getOrCreate(data: { roomId: string }) {
    const result = await this.getForRoom(data);
    if (result) {
      return result;
    }
    return this.create(data);
  }
}
