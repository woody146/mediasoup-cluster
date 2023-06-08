import 'node-fetch';

import apiRouters from './apis/master/index.js';
import { startServer } from './utils/index.js';

startServer(apiRouters);
