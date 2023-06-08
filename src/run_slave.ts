import 'node-fetch';

import {
  MediasoupSlaveService,
  mediasoupWorkerManager,
} from './services/index.js';
import { startServer, getDataSource } from './utils/index.js';

async function bootstrap() {
  await startServer([]);
  try {
    await mediasoupWorkerManager.init();
    await new MediasoupSlaveService(getDataSource()).addFromEnv();
  } catch (e) {}
}

bootstrap();
