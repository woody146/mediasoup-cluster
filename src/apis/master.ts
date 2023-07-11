import {
  TransportService,
  RoomService,
  RouterService,
  UserService,
  ProducerService,
  ConsumerService,
} from '../services/index.js';
import { RouteConfig, getEntityManager } from '../utils/index.js';

export default [
  {
    method: 'GET',
    url: '/rooms',
    handler: (data) => {
      return new RoomService(getEntityManager()).getList(data);
    },
  },
  {
    method: 'POST',
    url: '/rooms',
    handler: () => {
      return new RoomService(getEntityManager()).create({});
    },
  },
  {
    method: 'GET',
    url: '/rooms/:roomId',
    handler: (data) => {
      return new RoomService(getEntityManager()).getCapabilities(data);
    },
  },
  {
    method: 'DELETE',
    url: '/rooms/:roomId',
    handler: (data) => {
      return new RoomService(getEntityManager()).close(data);
    },
  },
  {
    method: 'POST',
    url: '/rooms/:roomId/consumer_routers',
    handler: (data) => {
      return new RouterService(getEntityManager()).getOrCreate(data);
    },
  },
  {
    method: 'POST',
    url: '/rooms/:roomId/producer_transports',
    handler: (data) => {
      return new TransportService(getEntityManager()).createProducer(data);
    },
  },
  {
    method: 'GET',
    url: '/rooms/:roomId/producer_transports',
    handler: (data) => {
      return new TransportService(getEntityManager()).getProducers(data);
    },
  },
  {
    method: 'POST',
    url: '/rooms/:roomId/consumer_transports',
    handler: (data) => {
      return new TransportService(getEntityManager()).createSameHostConsumer(
        data
      );
    },
  },
  {
    method: 'POST',
    url: '/router/:routerId/consumer_transports',
    handler: (data) => {
      return new TransportService(getEntityManager()).createConsumer(data);
    },
  },
  {
    method: 'POST',
    url: '/producer_transports/:transportId/connect',
    handler: (data) => {
      return new TransportService(getEntityManager()).connectProducer(data);
    },
  },
  {
    method: 'POST',
    url: '/consumer_transports/:transportId/connect',
    handler: (data) => {
      return new TransportService(getEntityManager()).connectConsumer(data);
    },
  },
  {
    method: 'POST',
    url: '/consumers/:consumerId/resume',
    handler: (data) => {
      return new ConsumerService(getEntityManager()).resume(data);
    },
  },
  {
    method: 'POST',
    url: '/producer_transports/:transportId/produce',
    handler: (data) => {
      return new ProducerService(getEntityManager()).create(data);
    },
  },
  {
    method: 'POST',
    url: '/producers/:producerId/resume',
    handler: (data) => {
      return new ProducerService(getEntityManager()).resume(data);
    },
  },
  {
    method: 'POST',
    url: '/producers/:producerId/pause',
    handler: (data) => {
      return new ProducerService(getEntityManager()).pause(data);
    },
  },
  {
    method: 'POST',
    url: '/consumer_transports/:transportId/consume',
    handler: (data) => {
      return new ConsumerService(getEntityManager()).create(data);
    },
  },
  {
    method: 'POST',
    url: '/user/:userId/logout',
    handler: (data) => {
      return new UserService(getEntityManager()).logout(data);
    },
  },
  {
    method: 'DELETE',
    url: '/transports/:transportId',
    handler: (data) => {
      return new TransportService(getEntityManager()).close(data);
    },
  },
] as RouteConfig[];
