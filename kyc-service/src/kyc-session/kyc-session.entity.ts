import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientApp } from '../client-app/client-app.entity';

@Entity('kyc_sessions')
export class KycSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ClientApp)
  clientApp: ClientApp;

  @Column()
  externalUserId: string;

  @Column()
  redirectUrl: string;

  @Column({ default: 'created' })
  status: string;

  @Column({ unique: true })
  token: string;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}