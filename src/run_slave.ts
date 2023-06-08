import { MediasoupSlaveService } from './services/mediasoup.slave.js';
import { startServer, getDataSource } from './utils/index.js';

async function bootstrap() {
  await startServer([]);
  try {
    await new MediasoupSlaveService(getDataSource()).addFromEnv();
  } catch (e) {}
}

bootstrap();
