import { types } from 'mediasoup';
import { mediasoupProducerWebRTCTransportManager } from './webrtc.transport.js';
import { ServiceError } from '../base.js';

class MediasoupProducerManager {
  static producers = new Map<string, types.Producer>();

  async create(data: {
    transportId: string;
    kind: types.MediaKind;
    rtpParameters: types.RtpParameters;
  }) {
    const transport = mediasoupProducerWebRTCTransportManager.get(
      data.transportId
    );
    const { kind, rtpParameters } = data;
    const producer = await transport.produce({ kind, rtpParameters });
    MediasoupProducerManager.producers.set(producer.id, producer);

    return { id: producer.id };
  }

  async pause(data: { producerId: string }) {
    const producer = this.get(data);
    await producer.pause();
    return {};
  }

  async resume(data: { producerId: string }) {
    const producer = this.get(data);
    await producer.resume();
    return {};
  }

  get(data: { producerId: string }) {
    const producer = MediasoupProducerManager.producers.get(data.producerId);
    if (producer) {
      return producer;
    }
    throw new ServiceError(404, 'Producer not found');
  }
}

export const mediasoupProducerManager = new MediasoupProducerManager();
