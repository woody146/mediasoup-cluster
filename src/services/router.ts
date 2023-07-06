import { types } from 'mediasoup';
import { constants } from '../constants.js';
import { MediaRouter } from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService, ServiceError } from './base.js';
import { RoomService } from './room.js';
import { WorkerService } from './worker.js';

export class RouterService extends BaseService {
  async createForRoom(data: { roomId: string }): Promise<{
    id: string;
    rtpCapabilities: types.RtpCapabilities;
  }> {
    const worker = await this.createService(WorkerService).getFor(
      constants.CONSUMER
    );
    const result = await fetchApi({
      host: worker.apiHost,
      port: worker.apiPort,
      path: '/routers',
      method: 'POST',
      data: { pid: worker.pid },
    });

    const mediaRouter = new MediaRouter();
    mediaRouter.id = result.id;
    mediaRouter.workerId = worker.id;
    Object.assign(mediaRouter, data);
    try {
      await this.entityManager.getRepository(MediaRouter).save(mediaRouter);
    } catch (e) {
      // violates foreign key constraint because room doesn't exist
      fetchApi({
        host: worker.apiHost,
        port: worker.apiPort,
        path: '/routers/:routerId',
        method: 'DELETE',
        data: { routerId: result.id },
      });
      throw new ServiceError(404, 'Room not found');
    }
    return result;
  }

  async getForRoom(data: { roomId: string }): Promise<{
    id: string;
    rtpCapabilities: types.RtpCapabilities;
  } | null> {
    const router = await this.entityManager
      .createQueryBuilder(MediaRouter, 'router')
      .leftJoinAndSelect('router.worker', 'worker')
      .where('router.roomId = :roomId', { roomId: data.roomId })
      .andWhere('worker.transportCount < worker.maxTransport')
      .getOne();
    if (router) {
      const result = await fetchApi({
        host: router.worker.apiHost,
        port: router.worker.apiPort,
        path: '/routers/:routerId',
        method: 'GET',
        data: { routerId: router.id },
      });
      return { ...result, id: router.id };
    }
    return null;
  }

  checkToPipe(data: { routerId: string; producerId: string }) {
    return this.entityManager.transaction(async (entityManager) => {
      const router = await entityManager.getRepository(MediaRouter).findOne({
        lock: { mode: 'pessimistic_write' },
        where: { id: data.routerId },
      });

      if (router && !router.pipedProducers.includes(data.producerId)) {
        const room = await new RoomService(entityManager).get({
          roomId: router.roomId,
        });
        const worker = await new WorkerService(entityManager).get({
          workerId: router.workerId,
        });

        await fetchApi({
          host: worker.apiHost,
          port: worker.apiPort,
          path: '/routers/:routerId/destination_pipe_transports',
          method: 'POST',
          data: {
            routerId: data.routerId,
            sourceHost: room.worker.apiHost,
            sourcePort: room.worker.apiPort,
            sourceRouterId: room.routerId,
            sourceProducerId: data.producerId,
          },
        });

        router.pipedProducers.push(data.producerId);
        await entityManager.save(router);
      }
    });
  }

  async get(data: { routerId: string }) {
    const router = await this.entityManager.getRepository(MediaRouter).findOne({
      relations: { worker: true },
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
    return this.createForRoom(data);
  }
}
