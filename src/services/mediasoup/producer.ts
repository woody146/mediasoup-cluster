import { types } from 'mediasoup';
import { mediasoupProducerWebRTCTransportManager } from './webrtc.transport.js';

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
}

export const mediasoupProducerManager = new MediasoupProducerManager();
