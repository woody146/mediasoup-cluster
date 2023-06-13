import { types } from 'mediasoup';
import { mediasoupConsumerWebRTCTransportManager } from './webrtc.transport.js';
import { ServiceError } from '../base.js';
import { mediasoupRouterManager } from './router.js';

class MediasoupConsumerManager {
  static consumers: Array<types.Consumer> = [];

  async create(data: {
    routerId: string;
    transportId: string;
    producerId: string;
    rtpCapabilities: types.RtpCapabilities;
  }) {
    const router = mediasoupRouterManager.get(data.routerId);
    if (!router) {
      throw new ServiceError(404, 'Router not found');
    }
    if (
      !router.canConsume({
        producerId: data.producerId,
        rtpCapabilities: data.rtpCapabilities,
      })
    ) {
      throw new ServiceError(400, 'can not consume');
    }
    const transport = mediasoupConsumerWebRTCTransportManager.get(
      data.transportId
    );
    if (!transport) {
      throw new ServiceError(404, 'Transport not found');
    }
    const consumer = await transport.consume({
      producerId: data.producerId,
      rtpCapabilities: data.rtpCapabilities,
      paused: true,
    });

    MediasoupConsumerManager.consumers.push(consumer);

    return {
      id: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused,
    };
  }

  resume(data: { consumerId: string }) {
    const consumer = this.get(data);
    if (consumer) {
      consumer.resume();
      return {};
    }
    throw new ServiceError(404, 'Consumer not found');
  }

  get(data: { consumerId: string }) {
    return MediasoupConsumerManager.consumers.find(
      (item) => item.id === data.consumerId
    );
  }
}

export const mediasoupConsumerManager = new MediasoupConsumerManager();
