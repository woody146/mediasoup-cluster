import { DataSource } from 'typeorm';
import * as entitiesMap from '../entities/index.js';

export const entities = Object.values(entitiesMap);

let _dataSource: DataSource;

export function getDataSource() {
  if (!_dataSource) {
    _dataSource = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: !!process.env.DATABASE_SYNC,
      logging: !!process.env.DATABASE_LOGGING,
      entities,
    });
  }
  return _dataSource;
}

export function getEntityManager() {
  return getDataSource().manager;
}
