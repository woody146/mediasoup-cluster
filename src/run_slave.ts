import 'node-fetch';

import apiRouters from './apis/slave.js';
import { WorkerService, mediasoupWorkerManager } from './services/index.js';
import { startServer, getEntityManager } from './utils/index.js';

async function bootstrap() {
  await startServer(apiRouters);

  await mediasoupWorkerManager.init();

  const workerService = new WorkerService(getEntityManager());
  // remove old room of dead slave
  await workerService.removeCurrent();
  await workerService.addWorkers(mediasoupWorkerManager.workers);
}

bootstrap();
