import { types } from 'mediasoup';
import { ServiceError } from '../base.js';
import { mediasoupRouterManager } from './router.js';

class MediasoupWebRTCTransportManager {
  static transports: Array<types.Transport> = [];

  async createProducer(routerId: string) {
    const router = mediasoupRouterManager.get(routerId);
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
      MediasoupWebRTCTransportManager.transports.push(transport);
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

export const mediasoupWebRTCTransportManager =
  new MediasoupWebRTCTransportManager();
