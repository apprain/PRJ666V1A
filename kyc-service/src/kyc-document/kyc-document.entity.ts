import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { KycSession } from '../kyc-session/kyc-session.entity';

@Entity('kyc_documents')
export class KycDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => KycSession)
  session: KycSession;

  @Column()
  documentType: string;

  @Column()
  originalFileName: string;

  @Column()
  minioObjectKey: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column({ default: 'uploaded' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}