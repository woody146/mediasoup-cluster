import 'node-fetch';

import apiRouters from './apis/slave/index.js';
import {
  MediasoupSlaveService,
  mediasoupWorkerManager,
} from './services/index.js';
import { startServer, getDataSource } from './utils/index.js';

async function bootstrap() {
  await startServer(apiRouters);
  try {
    await mediasoupWorkerManager.init();
    await new MediasoupSlaveService(getDataSource()).addFromEnv();
  } catch (e) {}
}

bootstrap();
