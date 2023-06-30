import {
  PeerService,
  RoomService,
  RouterService,
  UserService,
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
    url: '/rooms/:roomId/producer_peers',
    handler: (data) => {
      return new PeerService(getDataSource()).createProducer(data);
    },
  },
  {
    method: 'GET',
    url: '/rooms/:roomId/producer_peers',
    handler: (data) => {
      return new PeerService(getDataSource()).getProducers(data);
    },
  },
  {
    method: 'POST',
    url: '/rooms/:roomId/consumer_peers',
    handler: (data) => {
      return new PeerService(getDataSource()).createSameHostConsumer(data);
    },
  },
  {
    method: 'POST',
    url: '/router/:routerId/consumer_peers',
    handler: (data) => {
      return new PeerService(getDataSource()).createConsumer(data);
    },
  },
  {
    method: 'POST',
    url: '/producer_peers/:peerId/connect',
    handler: (data) => {
      return new PeerService(getDataSource()).connectProducer(data);
    },
  },
  {
    method: 'POST',
    url: '/consumer_peers/:peerId/connect',
    handler: (data) => {
      return new PeerService(getDataSource()).connectConsumer(data);
    },
  },
  {
    method: 'POST',
    url: '/consumer_peers/:peerId/resume',
    handler: (data) => {
      return new PeerService(getDataSource()).resume(data);
    },
  },
  {
    method: 'POST',
    url: '/producer_peers/:peerId/produce',
    handler: (data) => {
      return new PeerService(getDataSource()).produce(data);
    },
  },
  {
    method: 'POST',
    url: '/consumer_peers/:peerId/consume',
    handler: (data) => {
      return new PeerService(getDataSource()).consume(data);
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
