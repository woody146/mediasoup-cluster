import 'node-fetch';

import apiRouters from './apis/slave/index.js';
import { SlaveService, mediasoupWorkerManager } from './services/index.js';
import { startServer, getDataSource } from './utils/index.js';

async function bootstrap() {
  await startServer(apiRouters);

  const slaveService = new SlaveService(getDataSource());
  // remove old room of dead slave
  await slaveService.removeCurrent();
  await slaveService.addFromEnv();

  await mediasoupWorkerManager.init();
}

bootstrap();
