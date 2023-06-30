import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { MediaTransport } from './media.transport.js';

@Entity()
export class MediaConsumer extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  producerId!: string;

  @Column('uuid')
  transportId!: string;

  @ManyToOne(() => MediaTransport, (transport) => transport.consumers, {
    onDelete: 'CASCADE',
  })
  transport!: MediaTransport;

  @CreateDateColumn()
  createDate!: Date;
}
