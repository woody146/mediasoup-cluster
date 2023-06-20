import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { MediaPeer } from './media.peer.js';

@Entity()
export class MediaConsumer extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  producerId!: string;

  @Column('uuid')
  peerId!: string;

  @ManyToOne(() => MediaPeer, (peer) => peer.consumers, {
    onDelete: 'CASCADE',
  })
  peer!: MediaPeer;

  @CreateDateColumn()
  createDate!: Date;
}
