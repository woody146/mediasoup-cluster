import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  OneToMany,
} from 'typeorm';
import { MediaRoom } from './media.room.js';
import { MediaPeer } from './media.peer.js';

@Entity()
@Index(['internalHost', 'apiPort'], { unique: true })
export class MediaSlave extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column('text')
  internalHost!: string;

  @Column('text')
  externalHost!: string;

  @Column('text')
  for!: string; // consumer | producer

  @Column('integer')
  apiPort!: number;

  @Column('integer', { default: 1e9 })
  maxPeer!: number;

  @Column('integer', { default: 0 })
  peerCount!: number;

  @OneToMany(() => MediaRoom, (room) => room.slave)
  rooms!: MediaRoom[];

  @OneToMany(() => MediaPeer, (peer) => peer.slave)
  peers!: MediaRoom[];
}
