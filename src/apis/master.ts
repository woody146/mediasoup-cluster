import { PeerService, RoomService } from '../services/index.js';
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
    method: 'POST',
    url: '/rooms/:roomId/producer_peers',
    handler: (data) => {
      return new PeerService(getDataSource()).createProducer(data);
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
