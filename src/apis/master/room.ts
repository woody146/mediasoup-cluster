import { MediasoupRoomService } from '../../services/index.js';
import { RouteConfig, getDataSource } from '../../utils/index.js';

export const room: Array<RouteConfig> = [
  {
    method: 'POST',
    url: '/rooms',
    handler: () => {
      return new MediasoupRoomService(getDataSource()).create({});
    },
  },
];
