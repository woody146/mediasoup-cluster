import {
  mediasoupProducerManager,
  mediasoupProducerWebRTCTransportManager,
  mediasoupRouterManager,
} from '../services/index.js';
import { RouteConfig } from '../utils/index.js';

export default [
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
      return mediasoupProducerWebRTCTransportManager.create(data);
    },
  },
  {
    method: 'POST',
    url: '/transports/:transportId/producer',
    handler: (data) => {
      return mediasoupProducerManager.create(data);
    },
  },
] as RouteConfig[];
