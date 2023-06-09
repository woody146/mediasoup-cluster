import { types } from 'mediasoup';
import { ServiceError } from '../base.js';
import { mediasoupProducerWebRTCTransportManager } from './webrtc.transport.js';

class MediasoupProducerManager {
  static producers: Array<types.Producer> = [];

  async create(data: {
    transportId: string;
    kind: types.MediaKind;
    rtpParameters: types.RtpParameters;
  }) {
    const transport = mediasoupProducerWebRTCTransportManager.get(
      data.transportId
    );
    if (transport) {
      const { kind, rtpParameters } = data;
      const producer = await transport.produce({ kind, rtpParameters });
      MediasoupProducerManager.producers.push(producer);

      return { id: producer.id };
    }
    throw new ServiceError(404, 'Transport not found');
  }
}

export const mediasoupProducerManager = new MediasoupProducerManager();
