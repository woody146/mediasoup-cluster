import {
  mediasoupConsumerManager,
  mediasoupConsumerWebRTCTransportManager,
  mediasoupPipeTransportManager,
  mediasoupProducerManager,
  mediasoupProducerWebRTCTransportManager,
  mediasoupRouterManager,
} from '../services/index.js';
import { RouteConfig } from '../utils/index.js';

export default [
  {
    method: 'POST',
    url: '/routers',
    handler: (data) => {
      return mediasoupRouterManager.create(data);
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
    method: 'DELETE',
    url: '/routers/:routerId',
    handler: (data) => {
      return mediasoupRouterManager.close(data);
    },
  },
  {
    method: 'POST',
    url: '/routers/:routerId/destination_pipe_transports',
    handler: (data) => {
      return mediasoupPipeTransportManager.createDestination(data);
    },
  },
  {
    method: 'POST',
    url: '/routers/:routerId/source_pipe_transports',
    handler: (data) => {
      return mediasoupPipeTransportManager.createSource(data);
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
    method: 'DELETE',
    url: '/producer_transports/:transportId',
    handler: (data) => {
      return mediasoupProducerWebRTCTransportManager.close(data);
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
    method: 'DELETE',
    url: '/consumer_transports/:transportId',
    handler: (data) => {
      return mediasoupConsumerWebRTCTransportManager.close(data);
    },
  },
  {
    method: 'POST',
    url: '/pipe_transports/:transportId/consume',
    handler: (data) => {
      return mediasoupPipeTransportManager.consume(data);
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
  {
    method: 'POST',
    url: '/producers/:producerId/resume',
    handler: (data) => {
      return mediasoupProducerManager.resume(data);
    },
  },
  {
    method: 'POST',
    url: '/producers/:producerId/pause',
    handler: (data) => {
      return mediasoupProducerManager.pause(data);
    },
  },
  {
    method: 'POST',
    url: '/consumers/:consumerId/resume',
    handler: (data) => {
      return mediasoupConsumerManager.resume(data);
    },
  },
] as RouteConfig[];
