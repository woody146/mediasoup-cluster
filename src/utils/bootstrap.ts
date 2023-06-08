import Fastify from 'fastify';
import dotenv from 'dotenv';
import { getDataSource } from './datasource.js';

export interface RouteConfig {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  url: string;
  handler: (data: any) => any;
}

export async function startServer(routers: RouteConfig[]) {
  const server = Fastify({});
  dotenv.config();

  try {
    const port = process.env.PORT;
    await getDataSource().initialize();

    routers.map((route) => {
      server.route({
        method: route.method,
        url: route.url,
        handler: (request) => {
          const data = {};
          Object.assign(data, request.params, request.query, request.body);
          return route.handler(data);
        },
      });
    });

    const address = await server.listen({ port: port ? parseInt(port) : 3000 });
    console.log('✅ App ready: ' + address);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}