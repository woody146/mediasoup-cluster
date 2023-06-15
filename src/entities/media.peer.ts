import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { MediaSlave } from './media.slave.js';
import { MediaRoom } from './media.room.js';

@Entity()
export class MediaPeer extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('integer')
  slaveId!: number;

  @ManyToOne(() => MediaSlave, (slave) => slave.peers, {
    onDelete: 'CASCADE',
  })
  slave!: MediaSlave;

  @Column('uuid')
  roomId!: string;

  @ManyToOne(() => MediaRoom, (room) => room.peers, { onDelete: 'CASCADE' })
  room!: MediaRoom;

  @Column('uuid')
  routerId!: string;

  @Index()
  @Column('text', { nullable: true })
  userId?: string;

  @Column('uuid', { nullable: true })
  producerId?: string;

  @Column('uuid', { nullable: true })
  consumerId?: string;

  @Column('text')
  type!: string; // consumer | producer

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createDate!: Date;
}
