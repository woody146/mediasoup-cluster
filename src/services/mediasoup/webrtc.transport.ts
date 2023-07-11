import { types } from 'mediasoup';
import { ServiceError } from '../base.js';
import { mediasoupRouterManager } from './router.js';

class MediasoupWebRTCTransportManager {
  static transports = new Map<string, types.Transport>();

  get(transportId: string) {
    const transport = (
      this.constructor as typeof MediasoupWebRTCTransportManager
    ).transports.get(transportId);
    if (transport) {
      return transport;
    }
    throw new ServiceError(404, 'Transport not found');
  }

  async connect(data: { transportId: string; dtlsParameters: any }) {
    const transport = this.get(data.transportId);
    await transport.connect({ dtlsParameters: data.dtlsParameters });
    return {};
  }

  async close(data: { transportId: string }) {
    const transport = this.get(data.transportId);
    transport.close();
    (
      this.constructor as typeof MediasoupWebRTCTransportManager
    ).transports.delete(data.transportId);
  }
}

class MediasoupProducerWebRTCTransportManager extends MediasoupWebRTCTransportManager {
  static transports = new Map<string, types.Transport>();

  async create(data: { routerId: string }) {
    const router = mediasoupRouterManager.get(data.routerId);
    const maxIncomingBitrate =
      Number(process.env.MEDIASOUP_WEBRTC_TRANSPORT_MAX_INCOMING_BITRATE) ||
      1500000;
    const initialAvailableOutgoingBitrate =
      Number(
        process.env
          .MEDIASOUP_WEBRTC_TRANSPORT_INITIAL_AVAILABLE_OUTGOING_BITRATE
      ) || 1000000;
    const listenIps = JSON.parse(
      process.env.MEDIASOUP_WEBRTC_TRANSPORT_LISTEN_IPS || '[]'
    );

    const transport = await router.createWebRtcTransport({
      listenIps: listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate,
    });
    if (maxIncomingBitrate) {
      try {
        await transport.setMaxIncomingBitrate(maxIncomingBitrate);
      } catch (error) {}
    }

    const constructor = this
      .constructor as typeof MediasoupProducerWebRTCTransportManager;
    constructor.transports.set(transport.id, transport);

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
  }
}

class MediasoupConsumerWebRTCTransportManager extends MediasoupProducerWebRTCTransportManager {
  static transports = new Map<string, types.Transport>();
}

export const mediasoupProducerWebRTCTransportManager =
  new MediasoupProducerWebRTCTransportManager();

export const mediasoupConsumerWebRTCTransportManager =
  new MediasoupConsumerWebRTCTransportManager();
