import {
  Entity,
  BaseEntity,
  CreateDateColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  Index,
} from 'typeorm';
import { MediaSlave } from './media.slave.js';
import { MediaRoom } from './media.room.js';

@Entity()
@Index(['slaveId', 'roomId'], { unique: true })
export class MediaRouter extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('integer')
  slaveId!: number;

  @ManyToOne(() => MediaSlave, (slave) => slave.routers, {
    onDelete: 'CASCADE',
  })
  slave!: MediaSlave;

  @Column('uuid')
  roomId!: string;

  @ManyToOne(() => MediaRoom, (room) => room.routers, { onDelete: 'CASCADE' })
  room!: MediaRoom;

  @Column('text')
  sourceRouterId!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createDate!: Date;
}
