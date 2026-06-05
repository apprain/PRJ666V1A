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

  @Column({ type: 'text', nullable: true })
  ocrFullText: string | null;

  @Column({ type: 'jsonb', nullable: true })
  ocrLines: string[] | null;

  @Column({ type: 'timestamp', nullable: true })
  ocrCheckedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  ocrFirstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  ocrLastName: string | null;

  @Column({ type: 'varchar', nullable: true })
  ocrDocumentNumber: string | null;

}