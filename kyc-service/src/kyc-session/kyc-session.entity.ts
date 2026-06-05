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

  @Column({ nullable: true })
  reviewStatus: string;

  @Column({ type: 'text', nullable: true })
  reviewRemarks: string | null;

  @Column({ type: 'varchar', nullable: true })
  reviewedBy: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  faceMatchStatus: string | null;

  @Column({ type: 'float', nullable: true })
  faceMatchScore: number | null;

  @Column({ type: 'float', nullable: true })
  faceMatchConfidence: number | null;

  @Column({ type: 'timestamp', nullable: true })
  faceCheckedAt: Date | null;
}