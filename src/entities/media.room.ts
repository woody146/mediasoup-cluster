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

  @Column('text')
  routerId!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createDate!: Date;

  @OneToMany(() => MediaPeer, (peer) => peer.room)
  peers!: MediaRoom[];
}
