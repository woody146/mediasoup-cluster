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
import { MediaTransport } from './media.transport.js';
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

  @OneToMany(() => MediaTransport, (transport) => transport.room)
  transports!: MediaTransport[];

  @OneToMany(() => MediaRouter, (router) => router.room)
  routers!: MediaRouter[];
}
