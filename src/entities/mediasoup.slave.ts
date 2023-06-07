import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
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

  @Column('integer', { nullable: true })
  maxPeer?: number;

  @Column('integer', { default: 0 })
  peerCount!: number;
}