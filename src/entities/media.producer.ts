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
export class MediaProducer extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('text')
  kind!: string;

  @Column('uuid')
  peerId!: string;

  @ManyToOne(() => MediaPeer, (peer) => peer.producers, {
    onDelete: 'CASCADE',
  })
  peer!: MediaPeer;

  @CreateDateColumn()
  createDate!: Date;
}
