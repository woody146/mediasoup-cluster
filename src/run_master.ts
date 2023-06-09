import 'node-fetch';

import apiRouters from './apis/master.js';
import { startServer } from './utils/index.js';

startServer(apiRouters);
