import {
  TransportService,
  RoomService,
  RouterService,
  UserService,
  ProducerService,
  ConsumerService,
} from '../services/index.js';
import { RouteConfig, getDataSource } from '../utils/index.js';

export default [
  {
    method: 'GET',
    url: '/rooms',
    handler: (data) => {
      return new RoomService(getDataSource()).getList(data);
    },
  },
  {
    method: 'POST',
    url: '/rooms',
    handler: () => {
      return new RoomService(getDataSource()).create({});
    },
  },
  {
    method: 'GET',
    url: '/rooms/:roomId',
    handler: (data) => {
      return new RoomService(getDataSource()).getCapabilities(data);
    },
  },
  {
    method: 'DELETE',
    url: '/rooms/:roomId',
    handler: (data) => {
      return new RoomService(getDataSource()).close(data);
    },
  },
  {
    method: 'POST',
    url: '/rooms/:roomId/consumer_routers',
    handler: (data) => {
      return new RouterService(getDataSource()).getOrCreate(data);
    },
  },
  {
    method: 'POST',
    url: '/rooms/:roomId/producer_transports',
    handler: (data) => {
      return new TransportService(getDataSource()).createProducer(data);
    },
  },
  {
    method: 'GET',
    url: '/rooms/:roomId/producer_transports',
    handler: (data) => {
      return new TransportService(getDataSource()).getProducers(data);
    },
  },
  {
    method: 'POST',
    url: '/rooms/:roomId/consumer_transports',
    handler: (data) => {
      return new TransportService(getDataSource()).createSameHostConsumer(data);
    },
  },
  {
    method: 'POST',
    url: '/router/:routerId/consumer_transports',
    handler: (data) => {
      return new TransportService(getDataSource()).createConsumer(data);
    },
  },
  {
    method: 'POST',
    url: '/producer_transports/:transportId/connect',
    handler: (data) => {
      return new TransportService(getDataSource()).connectProducer(data);
    },
  },
  {
    method: 'POST',
    url: '/consumer_transports/:transportId/connect',
    handler: (data) => {
      return new TransportService(getDataSource()).connectConsumer(data);
    },
  },
  {
    method: 'POST',
    url: '/consumers/:consumerId/resume',
    handler: (data) => {
      return new ConsumerService(getDataSource()).resume(data);
    },
  },
  {
    method: 'POST',
    url: '/producer_transports/:transportId/produce',
    handler: (data) => {
      return new ProducerService(getDataSource()).create(data);
    },
  },
  {
    method: 'POST',
    url: '/producers/:producerId/resume',
    handler: (data) => {
      return new ProducerService(getDataSource()).resume(data);
    },
  },
  {
    method: 'POST',
    url: '/producers/:producerId/pause',
    handler: (data) => {
      return new ProducerService(getDataSource()).pause(data);
    },
  },
  {
    method: 'POST',
    url: '/consumer_transports/:transportId/consume',
    handler: (data) => {
      return new ConsumerService(getDataSource()).create(data);
    },
  },
  {
    method: 'POST',
    url: '/user/:userId/logout',
    handler: (data) => {
      return new UserService(getDataSource()).logout(data);
    },
  },
] as RouteConfig[];
