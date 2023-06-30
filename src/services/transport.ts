import { types } from 'mediasoup';

import { constants } from '../constants.js';
import {
  MediaConsumer,
  MediaTransport,
  MediaWorker,
} from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService, ServiceError } from './base.js';
import { RoomService } from './room.js';
import { RouterService } from './router.js';
import { MediaProducer } from '../entities/media.producer.js';

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

    await this.dataSource.getRepository(MediaTransport).save(mediaTransport);
    this.dataSource
      .getRepository(MediaWorker)
      .increment({ id: room.workerId }, 'transportCount', 1);
    return result;
  }

  async produce(data: {
    transportId: string;
    kind: any;
    rtpParameters: any;
  }): Promise<{
    /**
     * Producer id
     */
    id: string;
  }> {
    const transport = await this.get({ transportId: data.transportId });
    if (transport.type === constants.PRODUCER) {
      const result = await fetchApi({
        host: transport.worker.apiHost,
        port: transport.worker.apiPort,
        path: '/transports/:transportId/producer',
        method: 'POST',
        data: {
          transportId: transport.id,
          kind: data.kind,
          rtpParameters: data.rtpParameters,
        },
      });

      const producer = new MediaProducer();
      producer.id = result.id;
      producer.kind = data.kind;
      producer.transportId = transport.id;
      await this.dataSource.getRepository(MediaProducer).save(producer);
      return result;
    }
    throw new ServiceError(400, 'Invalid transport');
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

    await this.dataSource.getRepository(MediaTransport).save(mediaTransport);
    this.dataSource
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

    await this.dataSource.getRepository(MediaTransport).save(mediaTransport);
    this.dataSource
      .getRepository(MediaWorker)
      .increment({ id: room.workerId }, 'transportCount', 1);
    return result;
  }

  async consume(data: {
    transportId: string;
    producerId: string;
    rtpCapabilities: any;
  }): Promise<{
    /**
     * Consumer id
     */
    id: string;
  }> {
    const transport = await this.get({ transportId: data.transportId });
    if (transport.type === constants.CONSUMER) {
      await this.createService(RouterService).checkToPipe({
        routerId: transport.routerId,
        producerId: data.producerId,
      });

      const result = await fetchApi({
        host: transport.worker.apiHost,
        port: transport.worker.apiPort,
        path: '/transports/:transportId/consumer',
        method: 'POST',
        data: {
          transportId: transport.id,
          routerId: transport.routerId,
          producerId: data.producerId,
          rtpCapabilities: data.rtpCapabilities,
        },
      });

      const consumer = new MediaConsumer();
      consumer.id = result.id;
      consumer.producerId = data.producerId;
      consumer.transportId = transport.id;
      await this.dataSource.getRepository(MediaConsumer).save(consumer);
      return result;
    }
    throw new ServiceError(400, 'Invalid type transport');
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

  async resume(data: { transportId: string; consumerId: string }) {
    const transport = await this.get({ transportId: data.transportId });
    if (transport.type === constants.CONSUMER) {
      await fetchApi({
        host: transport.worker.apiHost,
        port: transport.worker.apiPort,
        path: '/consumers/:consumerId/resume',
        method: 'POST',
        data: { consumerId: data.consumerId },
      });
      return {};
    }
    throw new ServiceError(400, 'Invalid transport');
  }

  async get(data: { transportId: string }) {
    const transport = await this.dataSource
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

  async getProducers(data: { roomId: string }): Promise<{
    items: Array<{
      id: string;
      producers: Array<{ id: string; kind: string }>;
    }>;
  }> {
    const items = (await this.dataSource.getRepository(MediaTransport).find({
      relations: { producers: true },
      select: ['id', 'producers'],
      where: {
        roomId: data.roomId,
        type: constants.PRODUCER,
      },
    })) as any;
    return { items };
  }
}
