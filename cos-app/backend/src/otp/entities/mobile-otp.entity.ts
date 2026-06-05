import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('mobile_otps')
export class MobileOtp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    mobileNo: string;

    @Column()
    otpCode: string;

    @Column()
    expiresAt: Date;

    @Column({ default: false })
    isVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;
}