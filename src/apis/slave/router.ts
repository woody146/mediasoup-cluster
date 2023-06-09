import { mediasoupRouterManager } from '../../services/index.js';
import { RouteConfig } from '../../utils/index.js';

export const router: Array<RouteConfig> = [
  {
    method: 'POST',
    url: '/routers',
    handler: () => {
      return mediasoupRouterManager.create();
    },
  },
];
