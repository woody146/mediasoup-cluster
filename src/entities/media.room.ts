import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MediaSlave } from './media.slave.js';
import { MediaPeer } from './media.peer.js';
import { MediaRouter } from './media.router.js';

@Entity()
export class MediaRoom extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('integer')
  slaveId!: number;

  @ManyToOne(() => MediaSlave, (slave) => slave.rooms, {
    onDelete: 'CASCADE',
  })
  slave!: MediaSlave;

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
