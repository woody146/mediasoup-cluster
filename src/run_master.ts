import { startServer } from './utils/index.js';

startServer([
  {
    method: 'GET',
    url: '/',
    handler: () => ({ data: 'data' }),
  },
]);
