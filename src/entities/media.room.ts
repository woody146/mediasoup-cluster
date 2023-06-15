import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MediaWorker } from './media.worker.js';
import { MediaPeer } from './media.peer.js';
import { MediaRouter } from './media.router.js';

@Entity()
export class MediaRoom extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  workerId!: string;

  @ManyToOne(() => MediaWorker, (worker) => worker.rooms, {
    onDelete: 'CASCADE',
  })
  worker!: MediaWorker;

  // router to produce
  @Column('uuid')
  routerId!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createDate!: Date;

  @OneToMany(() => MediaPeer, (peer) => peer.room)
  peers!: MediaPeer[];

  @OneToMany(() => MediaRouter, (router) => router.room)
  routers!: MediaRouter[];
}
