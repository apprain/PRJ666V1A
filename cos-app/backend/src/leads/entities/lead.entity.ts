import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductType } from '../../common/enums/product-type.enum';

// export enum ProductType {
//   LOAN = 'LOAN',
//   BROKERAGE = 'BROKERAGE',
// }

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.LOAN,
  })
  productType: ProductType;

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