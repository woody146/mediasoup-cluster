import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
  Index,
  OneToMany,
} from 'typeorm';
import { MediaWorker } from './media.worker.js';
import { MediaRoom } from './media.room.js';
import { MediaConsumer } from './media.consumer.js';
import { MediaProducer } from './media.producer.js';

@Entity()
export class MediaPeer extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  workerId!: string;

  @ManyToOne(() => MediaWorker, (worker) => worker.peers, {
    onDelete: 'CASCADE',
  })
  worker!: MediaWorker;

  @Column('uuid')
  roomId!: string;

  @ManyToOne(() => MediaRoom, (room) => room.peers, { onDelete: 'CASCADE' })
  room!: MediaRoom;

  @Column('uuid')
  routerId!: string;

  @Index()
  @Column('text', { nullable: true })
  userId?: string;

  @OneToMany(() => MediaConsumer, (consumer) => consumer.peer)
  consumers!: MediaConsumer[];

  @OneToMany(() => MediaProducer, (producer) => producer.peer)
  producers!: MediaProducer[];

  @Column('text')
  type!: string; // consumer | producer

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createDate!: Date;
}
