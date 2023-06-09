import { PeerService, RoomService } from '../../services/index.js';
import { RouteConfig, getDataSource } from '../../utils/index.js';

export const room: Array<RouteConfig> = [
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
];
