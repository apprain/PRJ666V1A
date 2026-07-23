import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Organization } from "../organizations/organization.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "uuid", nullable: true })
  organizationId?: string;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: "organizationId" })
  organization?: Organization;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true, unique: true })
  mobile!: string;

  @Column({ default: false })
  mobileVerified!: boolean;

  @Column({ nullable: true })
  kycSessionId!: string;

  @Column({ default: false })
  kycVerified!: boolean;
}