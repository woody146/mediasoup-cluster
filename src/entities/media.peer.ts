import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
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

  @Column('text')
  routerId!: string;

  @Column('text')
  type!: string; // consumer | producer

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createDate!: Date;
}
