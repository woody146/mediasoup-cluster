import {
  mediasoupConsumerManager,
  mediasoupConsumerWebRTCTransportManager,
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
    method: 'GET',
    url: '/routers/:routerId',
    handler: (data) => {
      return mediasoupRouterManager.getRtpCapabilities(data);
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
    url: '/routers/:routerId/consumer_transports',
    handler: (data) => {
      return mediasoupConsumerWebRTCTransportManager.create(data);
    },
  },
  {
    method: 'POST',
    url: '/producer_transports/:transportId/connect',
    handler: (data) => {
      return mediasoupProducerWebRTCTransportManager.connect(data);
    },
  },
  {
    method: 'POST',
    url: '/consumer_transports/:transportId/connect',
    handler: (data) => {
      return mediasoupConsumerWebRTCTransportManager.connect(data);
    },
  },
  {
    method: 'POST',
    url: '/transports/:transportId/producer',
    handler: (data) => {
      return mediasoupProducerManager.create(data);
    },
  },
  {
    method: 'POST',
    url: '/transports/:transportId/consumer',
    handler: (data) => {
      return mediasoupConsumerManager.create(data);
    },
  },
] as RouteConfig[];
