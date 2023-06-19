import { types } from 'mediasoup';
import { IsNull, Not } from 'typeorm';

import { constants } from '../constants.js';
import { MediaPeer, MediaWorker } from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService, ServiceError } from './base.js';
import { RoomService } from './room.js';
import { RouterService } from './router.js';

export class PeerService extends BaseService {
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
      host: room.worker.internalHost,
      port: room.worker.apiPort,
      path: '/routers/:routerId/producer_transports',
      method: 'POST',
      data: { routerId: room.routerId },
    });
    const mediaPeer = new MediaPeer();
    mediaPeer.id = result.id;
    mediaPeer.routerId = room.routerId;
    mediaPeer.workerId = room.worker.id;
    mediaPeer.type = constants.PRODUCER;
    mediaPeer.roomId = room.id;
    mediaPeer.userId = data.userId;

    await this.dataSource.getRepository(MediaPeer).save(mediaPeer);
    this.dataSource
      .getRepository(MediaWorker)
      .increment({ id: room.workerId }, 'peerCount', 1);
    return result;
  }

  async produce(data: {
    peerId: string;
    kind: any;
    rtpParameters: any;
  }): Promise<{
    /**
     * Producer id
     */
    id: string;
  }> {
    const peer = await this.get({ peerId: data.peerId });
    if (peer.type === constants.PRODUCER) {
      const result = await fetchApi({
        host: peer.worker.internalHost,
        port: peer.worker.apiPort,
        path: '/transports/:transportId/producer',
        method: 'POST',
        data: {
          transportId: peer.id,
          kind: data.kind,
          rtpParameters: data.rtpParameters,
        },
      });

      peer.producerId = result.id;
      await this.dataSource.getRepository(MediaPeer).save(peer);
      return result;
    }
    throw new ServiceError(400, 'Invalid peer');
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
      host: router.worker.internalHost,
      port: router.worker.apiPort,
      path: '/routers/:routerId/consumer_transports',
      method: 'POST',
      data: { routerId: router.id },
    });
    const mediaPeer = new MediaPeer();
    mediaPeer.id = result.id;
    mediaPeer.routerId = router.id;
    mediaPeer.workerId = router.worker.id;
    mediaPeer.type = constants.CONSUMER;
    mediaPeer.roomId = router.roomId;
    mediaPeer.userId = data.userId;

    await this.dataSource.getRepository(MediaPeer).save(mediaPeer);
    this.dataSource
      .getRepository(MediaWorker)
      .increment({ id: router.workerId }, 'peerCount', 1);
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
      host: room.worker.internalHost,
      port: room.worker.apiPort,
      path: '/routers/:routerId/consumer_transports',
      method: 'POST',
      data: { routerId: room.routerId },
    });
    const mediaPeer = new MediaPeer();
    mediaPeer.id = result.id;
    mediaPeer.routerId = room.routerId;
    mediaPeer.workerId = room.worker.id;
    mediaPeer.type = constants.CONSUMER;
    mediaPeer.roomId = room.id;
    mediaPeer.userId = data.userId;

    await this.dataSource.getRepository(MediaPeer).save(mediaPeer);
    this.dataSource
      .getRepository(MediaWorker)
      .increment({ id: room.workerId }, 'peerCount', 1);
    return result;
  }

  async consume(data: {
    peerId: string;
    producerId: string;
    rtpCapabilities: any;
  }): Promise<{
    /**
     * Consumer id
     */
    id: string;
  }> {
    const peer = await this.get({ peerId: data.peerId });
    if (peer.type === constants.CONSUMER) {
      await this.createService(RouterService).checkToPipe({
        routerId: peer.routerId,
        producerId: data.producerId,
      });

      const result = await fetchApi({
        host: peer.worker.internalHost,
        port: peer.worker.apiPort,
        path: '/transports/:transportId/consumer',
        method: 'POST',
        data: {
          transportId: peer.id,
          routerId: peer.routerId,
          producerId: data.producerId,
          rtpCapabilities: data.rtpCapabilities,
        },
      });

      peer.consumerId = result.id;
      peer.producerId = data.producerId;
      await this.dataSource.getRepository(MediaPeer).save(peer);
      return result;
    }
    throw new ServiceError(400, 'Invalid type peer');
  }

  async connectProducer(data: { peerId: string; dtlsParameters: any }) {
    const peer = await this.get({ peerId: data.peerId });
    if (peer.type === constants.PRODUCER) {
      await fetchApi({
        host: peer.worker.internalHost,
        port: peer.worker.apiPort,
        path: `/producer_transports/:transportId/connect`,
        method: 'POST',
        data: {
          transportId: peer.id,
          dtlsParameters: data.dtlsParameters,
        },
      });
      return {};
    }
    throw new ServiceError(400, 'Invalid type peer');
  }

  async connectConsumer(data: { peerId: string; dtlsParameters: any }) {
    const peer = await this.get({ peerId: data.peerId });
    if (peer.type === constants.CONSUMER) {
      await fetchApi({
        host: peer.worker.internalHost,
        port: peer.worker.apiPort,
        path: `/consumer_transports/:transportId/connect`,
        method: 'POST',
        data: {
          transportId: peer.id,
          dtlsParameters: data.dtlsParameters,
        },
      });
      return {};
    }
    throw new ServiceError(400, 'Invalid type peer');
  }

  async resume(data: { peerId: string }) {
    const peer = await this.get({ peerId: data.peerId });
    if (peer.consumerId && peer.type === constants.CONSUMER) {
      await fetchApi({
        host: peer.worker.internalHost,
        port: peer.worker.apiPort,
        path: '/consumers/:consumerId/resume',
        method: 'POST',
        data: {
          consumerId: peer.consumerId,
        },
      });
      return {};
    }
    throw new ServiceError(400, 'Invalid peer');
  }

  async get(data: { peerId: string }) {
    const peer = await this.dataSource.getRepository(MediaPeer).findOne({
      relations: { worker: true },
      where: { id: data.peerId },
    });
    if (peer) {
      return peer;
    }
    throw new ServiceError(404, 'Peer not found');
  }

  async getProducers(data: { roomId: string }): Promise<
    Array<{
      id: string;
      producerId: string;
    }>
  > {
    return this.dataSource.getRepository(MediaPeer).find({
      select: ['id', 'producerId'],
      where: {
        roomId: data.roomId,
        producerId: Not(IsNull()),
        type: constants.PRODUCER,
      },
    }) as any;
  }
}
