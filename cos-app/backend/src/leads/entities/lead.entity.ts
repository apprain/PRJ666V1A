import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  mobileNo: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  documentNumber: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ default: 'LEAD_CREATED' })
  leadStatus: string;

  @Column({ default: 'NOT_STARTED' })
  kycStatus: string;

  @Column({ nullable: true })
  kycSessionId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  faceMatchScore: number;

  @Column({ nullable: true })
  faceMatchStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}