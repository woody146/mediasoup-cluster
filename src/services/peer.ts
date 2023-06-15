import { IsNull, Not } from 'typeorm';

import { constants } from '../constants.js';
import { MediaPeer } from '../entities/index.js';
import { fetchApi } from '../utils/api.js';
import { BaseService, ServiceError } from './base.js';
import { RoomService } from './room.js';
import { RouterService } from './router.js';

export class PeerService extends BaseService {
  async createProducer(data: { roomId: string; metadata?: any }) {
    const room = await this.createService(RoomService).get({
      roomId: data.roomId,
    });
    const result = await fetchApi({
      host: room.slave.internalHost,
      port: room.slave.apiPort,
      path: '/routers/:routerId/producer_transports',
      method: 'POST',
      data: { routerId: room.routerId },
    });
    const mediaPeer = new MediaPeer();
    mediaPeer.id = result.id;
    mediaPeer.routerId = room.routerId;
    mediaPeer.slaveId = room.slave.id;
    mediaPeer.type = constants.PRODUCER;
    mediaPeer.roomId = room.id;

    await this.dataSource.getRepository(MediaPeer).save(mediaPeer);
    return result;
  }

  async produce(data: { peerId: string; kind: any; rtpParameters: any }) {
    const peer = await this.get({ peerId: data.peerId });
    if (peer.type === constants.PRODUCER) {
      const result = await fetchApi({
        host: peer.slave.internalHost,
        port: peer.slave.apiPort,
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
  }

  async createConsumer(data: { routerId: string }) {
    const router = await this.createService(RouterService).get({
      routerId: data.routerId,
    });
    const result = await fetchApi({
      host: router.slave.internalHost,
      port: router.slave.apiPort,
      path: '/routers/:routerId/consumer_transports',
      method: 'POST',
      data: { routerId: router.id },
    });
    const mediaPeer = new MediaPeer();
    mediaPeer.id = result.id;
    mediaPeer.routerId = router.id;
    mediaPeer.slaveId = router.slave.id;
    mediaPeer.type = constants.CONSUMER;
    mediaPeer.roomId = router.roomId;

    await this.dataSource.getRepository(MediaPeer).save(mediaPeer);
    return result;
  }

  // create consumer same host with producer
  async createSameHostConsumer(data: { roomId: string; metadata?: any }) {
    const room = await this.createService(RoomService).get({
      roomId: data.roomId,
    });
    const result = await fetchApi({
      host: room.slave.internalHost,
      port: room.slave.apiPort,
      path: '/routers/:routerId/consumer_transports',
      method: 'POST',
      data: { routerId: room.routerId },
    });
    const mediaPeer = new MediaPeer();
    mediaPeer.id = result.id;
    mediaPeer.routerId = room.routerId;
    mediaPeer.slaveId = room.slave.id;
    mediaPeer.type = constants.CONSUMER;
    mediaPeer.roomId = room.id;

    await this.dataSource.getRepository(MediaPeer).save(mediaPeer);
    return result;
  }

  async consume(data: {
    peerId: string;
    producerId: string;
    kind: any;
    rtpCapabilities: any;
  }) {
    const peer = await this.get({ peerId: data.peerId });
    if (peer.type === constants.CONSUMER) {
      await this.createService(RouterService).checkToPipe({
        routerId: peer.routerId,
        producerId: data.producerId,
      });

      const result = await fetchApi({
        host: peer.slave.internalHost,
        port: peer.slave.apiPort,
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

  async connect(data: { peerId: string; dtlsParameters: any }) {
    const peer = await this.get({ peerId: data.peerId });
    const result = await fetchApi({
      host: peer.slave.internalHost,
      port: peer.slave.apiPort,
      path:
        peer.type === constants.CONSUMER
          ? `/consumer_transports/:transportId/connect`
          : `/producer_transports/:transportId/connect`,
      method: 'POST',
      data: {
        transportId: peer.id,
        dtlsParameters: data.dtlsParameters,
      },
    });
    return result;
  }

  async resume(data: { peerId: string }) {
    const peer = await this.get({ peerId: data.peerId });
    if (peer.consumerId && peer.type === constants.CONSUMER) {
      const result = await fetchApi({
        host: peer.slave.internalHost,
        port: peer.slave.apiPort,
        path: '/consumers/:consumerId/resume',
        method: 'POST',
        data: {
          consumerId: peer.consumerId,
        },
      });
      return result;
    }
  }

  async get(data: { peerId: string }) {
    const peer = await this.dataSource.getRepository(MediaPeer).findOne({
      relations: { slave: true },
      where: { id: data.peerId },
    });
    if (peer) {
      return peer;
    }
    throw new ServiceError(404, 'Peer not found');
  }

  async getProducers(data: { roomId: string }) {
    return this.dataSource.getRepository(MediaPeer).find({
      select: ['id', 'producerId'],
      where: {
        roomId: data.roomId,
        producerId: Not(IsNull()),
        type: constants.PRODUCER,
      },
    });
  }
}
