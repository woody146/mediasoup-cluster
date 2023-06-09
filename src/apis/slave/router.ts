import {
  mediasoupRouterManager,
  mediasoupWebRTCTransportManager,
} from '../../services/index.js';
import { RouteConfig } from '../../utils/index.js';

export const router: Array<RouteConfig> = [
  {
    method: 'POST',
    url: '/routers',
    handler: () => {
      return mediasoupRouterManager.create();
    },
  },
  {
    method: 'POST',
    url: '/routers/:routerId/producer_transports',
    handler: (data) => {
      return mediasoupWebRTCTransportManager.createProducer(data.routerId);
    },
  },
];
