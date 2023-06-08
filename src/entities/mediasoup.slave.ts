import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
} from 'typeorm';

@Entity()
@Index(['internalHost', 'apiPort'], { unique: true })
export class MediasoupSlave extends BaseEntity {
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
}
