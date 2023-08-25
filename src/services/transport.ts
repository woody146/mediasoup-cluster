import { types } from 'mediasoup';

import { constants } from '../constants.js';
import { MediaTransport, MediaWorker } from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService, ServiceError } from './base.js';
import { RoomService } from './room.js';
import { RouterService } from './router.js';

export class TransportService extends BaseService {
  async createProducer(data: {
    roomId: string;
    userId?: string;
    metadata?: any;
  }): Promise<{
    id: string;
    iceParameters: types.IceParameters;
    iceCandidates: types.IceCandidate[];
    dtlsParameters: types.DtlsParameters;
  }> {
    const room = await this.createService(RoomService).get({
      roomId: data.roomId,
    });
    const result = await fetchApi({
      host: room.worker.apiHost,
      port: room.worker.apiPort,
      path: '/routers/:routerId/producer_transports',
      method: 'POST',
      data: { routerId: room.routerId },
    });
    const mediaTransport = new MediaTransport();
    mediaTransport.id = result.id;
    mediaTransport.routerId = room.routerId;
    mediaTransport.workerId = room.worker.id;
    mediaTransport.type = constants.PRODUCER;
    mediaTransport.roomId = room.id;
    mediaTransport.userId = data.userId;

    await this.entityManager.getRepository(MediaTransport).save(mediaTransport);
    this.entityManager
      .getRepository(MediaWorker)
      .increment({ id: room.workerId }, 'transportCount', 1);
    return result;
  }

  async createConsumer(data: { routerId: string; userId?: string }): Promise<{
    id: string;
    iceParameters: types.IceParameters;
    iceCandidates: types.IceCandidate[];
    dtlsParameters: types.DtlsParameters;
  }> {
    const router = await this.createService(RouterService).get({
      routerId: data.routerId,
    });
    const result = await fetchApi({
      host: router.worker.apiHost,
      port: router.worker.apiPort,
      path: '/routers/:routerId/consumer_transports',
      method: 'POST',
      data: { routerId: router.id },
    });
    const mediaTransport = new MediaTransport();
    mediaTransport.id = result.id;
    mediaTransport.routerId = router.id;
    mediaTransport.workerId = router.worker.id;
    mediaTransport.type = constants.CONSUMER;
    mediaTransport.roomId = router.roomId;
    mediaTransport.userId = data.userId;

    await this.entityManager.getRepository(MediaTransport).save(mediaTransport);
    this.entityManager
      .getRepository(MediaWorker)
      .increment({ id: router.workerId }, 'transportCount', 1);
    return result;
  }

  // create consumer same host with producer
  async createSameHostConsumer(data: {
    roomId: string;
    userId?: string;
    metadata?: any;
  }): Promise<{
    id: string;
    iceParameters: types.IceParameters;
    iceCandidates: types.IceCandidate[];
    dtlsParameters: types.DtlsParameters;
  }> {
    const room = await this.createService(RoomService).get({
      roomId: data.roomId,
    });
    const result = await fetchApi({
      host: room.worker.apiHost,
      port: room.worker.apiPort,
      path: '/routers/:routerId/consumer_transports',
      method: 'POST',
      data: { routerId: room.routerId },
    });
    const mediaTransport = new MediaTransport();
    mediaTransport.id = result.id;
    mediaTransport.routerId = room.routerId;
    mediaTransport.workerId = room.worker.id;
    mediaTransport.type = constants.CONSUMER;
    mediaTransport.roomId = room.id;
    mediaTransport.userId = data.userId;

    await this.entityManager.getRepository(MediaTransport).save(mediaTransport);
    this.entityManager
      .getRepository(MediaWorker)
      .increment({ id: room.workerId }, 'transportCount', 1);
    return result;
  }

  async connectProducer(data: { transportId: string; dtlsParameters: any }) {
    const transport = await this.get({ transportId: data.transportId });
    if (transport.type === constants.PRODUCER) {
      await fetchApi({
        host: transport.worker.apiHost,
        port: transport.worker.apiPort,
        path: `/producer_transports/:transportId/connect`,
        method: 'POST',
        data: {
          transportId: transport.id,
          dtlsParameters: data.dtlsParameters,
        },
      });
      return {};
    }
    throw new ServiceError(400, 'Invalid type transport');
  }

  async connectConsumer(data: { transportId: string; dtlsParameters: any }) {
    const transport = await this.get({ transportId: data.transportId });
    if (transport.type === constants.CONSUMER) {
      await fetchApi({
        host: transport.worker.apiHost,
        port: transport.worker.apiPort,
        path: `/consumer_transports/:transportId/connect`,
        method: 'POST',
        data: {
          transportId: transport.id,
          dtlsParameters: data.dtlsParameters,
        },
      });
      return {};
    }
    throw new ServiceError(400, 'Invalid type transport');
  }

  async get(data: { transportId: string }) {
    const transport = await this.entityManager
      .getRepository(MediaTransport)
      .findOne({
        relations: { worker: true },
        where: { id: data.transportId },
      });
    if (transport) {
      return transport;
    }
    throw new ServiceError(404, 'Transport not found');
  }

  async close(data: { transportId: string }) {
    const transport = await this.get(data);
    await this.closeTransport(transport);
    return {};
  }

  async closeTransport(transport: MediaTransport) {
    try {
      await fetchApi({
        host: transport.worker.apiHost,
        port: transport.worker.apiPort,
        path:
          transport.type === constants.CONSUMER
            ? `/consumer_transports/:transportId`
            : `/producer_transports/:transportId`,
        method: 'DELETE',
        data: { transportId: transport.id },
      });
    } catch {}
    await this.entityManager
      .getRepository(MediaTransport)
      .delete({ id: transport.id });
    await this.entityManager
      .getRepository(MediaWorker)
      .decrement({ id: transport.workerId }, 'transportCount', 1);
  }

  async getProducers(data: { roomId: string }): Promise<{
    items: Array<{
      id: string;
      userId: string;
      producers: Array<{ id: string; kind: string }>;
    }>;
  }> {
    const items = (await this.entityManager.getRepository(MediaTransport).find({
      relations: { producers: true },
      select: ['id', 'producers', 'userId'],
      where: {
        roomId: data.roomId,
        type: constants.PRODUCER,
      },
    })) as any;
    return { items };
  }
}
