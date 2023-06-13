import { PeerService, RoomService, RouterService } from '../services/index.js';
import { RouteConfig, getDataSource } from '../utils/index.js';

export default [
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
    method: 'POST',
    url: '/rooms/:roomId/join',
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
      return new PeerService(getDataSource()).createConsumer(data);
    },
  },
  {
    method: 'POST',
    url: '/peers/:peerId/connect',
    handler: (data) => {
      return new PeerService(getDataSource()).connect(data);
    },
  },
  {
    method: 'POST',
    url: '/peers/:peerId/resume',
    handler: (data) => {
      return new PeerService(getDataSource()).resume(data);
    },
  },
  {
    method: 'POST',
    url: '/peers/:peerId/produce',
    handler: (data) => {
      return new PeerService(getDataSource()).produce(data);
    },
  },
  {
    method: 'POST',
    url: '/peers/:peerId/consume',
    handler: (data) => {
      return new PeerService(getDataSource()).consume(data);
    },
  },
] as RouteConfig[];
