import { types } from 'mediasoup';
import { mediasoupConsumerWebRTCTransportManager } from './webrtc.transport.js';
import { ServiceError } from '../base.js';
import { mediasoupRouterManager } from './router.js';

class MediasoupConsumerManager {
  static consumers = new Map<string, types.Consumer>();

  async create(data: {
    routerId: string;
    transportId: string;
    producerId: string;
    rtpCapabilities: types.RtpCapabilities;
  }) {
    const router = mediasoupRouterManager.get(data.routerId);
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
    const consumer = await transport.consume({
      producerId: data.producerId,
      rtpCapabilities: data.rtpCapabilities,
      paused: true,
    });

    MediasoupConsumerManager.consumers.set(consumer.id, consumer);

    return {
      id: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused,
    };
  }

  async resume(data: { consumerId: string }) {
    const consumer = this.get(data);
    await consumer.resume();
    return {};
  }

  get(data: { consumerId: string }) {
    const consumer = MediasoupConsumerManager.consumers.get(data.consumerId);
    if (consumer) {
      return consumer;
    }
    throw new ServiceError(404, 'Consumer not found');
  }
}

export const mediasoupConsumerManager = new MediasoupConsumerManager();
