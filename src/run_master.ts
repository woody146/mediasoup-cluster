import Fastify from 'fastify';
import dotenv from 'dotenv';
import { getDataSource } from './datasource.js';

export async function startServer() {
  const server = Fastify({});
  dotenv.config();

  try {
    const port = process.env.PORT;
    await getDataSource().initialize();
    await server.listen({ port: port ? parseInt(port) : 3000 });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();
