import 'node-fetch';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import apiRouters from './apis/slave.js';
import { WorkerService, mediasoupWorkerManager } from './services/index.js';
import { startServer, getDataSource } from './utils/index.js';
import { constants } from './constants.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function bootstrap() {
  await startServer(
    apiRouters,
    process.env.SLAVE_FOR === constants.PRODUCER
      ? {
          staticFolder: join(__dirname, '../static/slave_producer'),
        }
      : {}
  );

  await mediasoupWorkerManager.init();

  const workerService = new WorkerService(getDataSource());
  // remove old room of dead slave
  await workerService.removeCurrent();
  await workerService.addWorkers(mediasoupWorkerManager.workers);
}

bootstrap();
