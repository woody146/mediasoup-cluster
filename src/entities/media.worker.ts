import {
  Entity,
  Column,
  BaseEntity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MediaRoom } from './media.room.js';
import { MediaPeer } from './media.peer.js';
import { MediaRouter } from './media.router.js';

@Entity()
@Index(['apiHost', 'apiPort', 'pid'], { unique: true })
export class MediaWorker extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  apiHost!: string;

  @Column('text')
  for!: string; // consumer | producer

  @Column('integer')
  apiPort!: number;

  @Column('integer')
  pid!: number;

  @Column('integer', { default: 1e9 })
  maxPeer!: number;

  @Column('integer', { default: 0 })
  peerCount!: number;

  @OneToMany(() => MediaRoom, (room) => room.worker)
  rooms!: MediaRoom[];

  @OneToMany(() => MediaPeer, (peer) => peer.worker)
  peers!: MediaPeer[];

  @OneToMany(() => MediaRouter, (router) => router.worker)
  routers!: MediaRouter[];
}
