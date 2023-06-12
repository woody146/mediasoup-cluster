import { types } from 'mediasoup';
import { ServiceError } from '../base.js';
import { mediasoupRouterManager } from './router.js';

class MediasoupWebRTCTransportManager {
  static transports: Array<types.Transport> = [];

  get(transportId: string) {
    return (
      this.constructor as typeof MediasoupWebRTCTransportManager
    ).transports.find((item) => item.id === transportId);
  }

  async connect(data: { transportId: string; dtlsParameters: any }) {
    const transport = this.get(data.transportId);
    if (transport) {
      await transport.connect({ dtlsParameters: data.dtlsParameters });
      return {};
    }
    throw new ServiceError(404, 'Transport not found');
  }
}

class MediasoupProducerWebRTCTransportManager extends MediasoupWebRTCTransportManager {
  static transports: Array<types.Transport> = [];

  async create(data: { routerId: string }) {
    const router = mediasoupRouterManager.get(data.routerId);
    if (router) {
      const maxIncomingBitrate = Number(
        process.env.MEDIASOUP_WEBRTC_TRANSPORT_MAX_INCOMING_BITRATE
      );
      const initialAvailableOutgoingBitrate = Number(
        process.env
          .MEDIASOUP_WEBRTC_TRANSPORT_INITIAL_AVAILABLE_OUTGOING_BITRATE
      );
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
      (
        this.constructor as typeof MediasoupProducerWebRTCTransportManager
      ).transports.push(transport);

      return {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      };
    }
    throw new ServiceError(404, 'Router not found');
  }
}

class MediasoupConsumerWebRTCTransportManager extends MediasoupProducerWebRTCTransportManager {
  static transports: Array<types.Transport> = [];
}

export const mediasoupProducerWebRTCTransportManager =
  new MediasoupProducerWebRTCTransportManager();

export const mediasoupConsumerWebRTCTransportManager =
  new MediasoupConsumerWebRTCTransportManager();
