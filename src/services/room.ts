import { types } from 'mediasoup';
import { constants } from '../constants.js';
import { MediaRoom, MediaRouter } from '../entities/index.js';
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
    await this.closeRouters({ roomId: room.id });
    try {
      await fetchApi({
        host: room.worker.apiHost,
        port: room.worker.apiPort,
        path: '/routers/:routerId',
        method: 'DELETE',
        data: { routerId: room.routerId },
      });
    } catch {}
    await this.entityManager.getRepository(MediaRoom).remove(room);
    return {};
  }

  async closeRouters(data: { roomId: string }) {
    const routers = await this.entityManager.getRepository(MediaRouter).find({
      relations: { worker: true },
      where: { roomId: data.roomId },
    });
    await Promise.all(
      routers.map(async (router) => {
        try {
          await fetchApi({
            host: router.worker.apiHost,
            port: router.worker.apiPort,
            path: '/routers/:routerId',
            method: 'DELETE',
            data: { routerId: router.id },
          });
        } catch {}
        await this.entityManager.getRepository(MediaRouter).remove(router);
      })
    );
    return {};
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
