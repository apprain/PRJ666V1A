import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

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

  @Column({ nullable: true })
  organizationname!: string;
}