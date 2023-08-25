import { types } from 'mediasoup';
import { constants } from '../constants.js';
import {
  MediaRoom,
  MediaRouter,
  MediaTransport,
  MediaWorker,
} from '../entities/index.js';
import { fetchApi } from '../utils/index.js';
import { ServiceError, BaseService } from './base.js';
import { WorkerService } from './worker.js';

export class RoomService extends BaseService {
  async create(data: { metadata?: any }): Promise<{
    id: string;
    rtpCapabilities: types.RtpCapabilities;
  }> {
    const worker = await this.createService(WorkerService).getFor(
      constants.PRODUCER
    );
    const result = await fetchApi({
      host: worker.apiHost,
      port: worker.apiPort,
      path: '/routers',
      method: 'POST',
      data: { pid: worker.pid },
    });
    const mediaRoom = new MediaRoom();
    mediaRoom.routerId = result.id;
    mediaRoom.workerId = worker.id;
    Object.assign(mediaRoom, data);
    await this.entityManager.getRepository(MediaRoom).save(mediaRoom);
    return { ...result, id: mediaRoom.id };
  }

  async get(data: { roomId: string }) {
    const room = await this.entityManager.getRepository(MediaRoom).findOne({
      relations: { worker: true },
      where: { id: data.roomId },
    });
    if (room) {
      return room;
    }
    throw new ServiceError(404, 'Room not found');
  }

  async getList({
    page = 1,
    pageSize = 30,
    orderBy = '-createDate',
  }: {
    pageSize?: number;
    page?: number;
    orderBy?: string;
  }) {
    const [items, total] = await this.entityManager
      .getRepository(MediaRoom)
      .findAndCount({
        take: Math.max(pageSize, 100),
        skip: (page - 1) * pageSize,
        order: { [orderBy.slice(1)]: orderBy[0] === '-' ? 'DESC' : 'ASC' },
      });
    return {
      items,
      pagination: { page, pageSize, total },
    };
  }

  async close(data: { roomId: string }) {
    const room = await this.get(data);
    await this.closeConsumerRouters({ roomId: room.id });
    await this.closeRouter({ routerId: room.routerId, worker: room.worker });

    await this.entityManager.getRepository(MediaRoom).delete({ id: room.id });
    return {};
  }

  private async closeConsumerRouters(data: { roomId: string }) {
    const routers = await this.entityManager.getRepository(MediaRouter).find({
      relations: { worker: true },
      where: { roomId: data.roomId },
    });
    await Promise.all(
      routers.map((router) =>
        this.closeRouter({ routerId: router.id, worker: router.worker })
      )
    );
    return {};
  }

  private async closeRouter(data: { routerId: string; worker: MediaWorker }) {
    try {
      await fetchApi({
        host: data.worker.apiHost,
        port: data.worker.apiPort,
        path: '/routers/:routerId',
        method: 'DELETE',
        data: { routerId: data.routerId },
      });
    } catch {}
    const count = await this.entityManager
      .getRepository(MediaTransport)
      .count({ where: { routerId: data.routerId } });
    if (count > 0) {
      await this.entityManager
        .getRepository(MediaWorker)
        .decrement({ id: data.worker.id }, 'transportCount', count);
    }
    await this.entityManager
      .getRepository(MediaRouter)
      .delete({ id: data.routerId });
  }

  async getCapabilities(data: { roomId: string }): Promise<{
    id: string;
    rtpCapabilities: types.RtpCapabilities;
  }> {
    const room = await this.get(data);
    const result = await fetchApi({
      host: room.worker.apiHost,
      port: room.worker.apiPort,
      path: '/routers/:routerId',
      method: 'GET',
      data: { routerId: room.routerId },
    });
    return { ...result, id: data.roomId };
  }
}
