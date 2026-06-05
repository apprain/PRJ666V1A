import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('lead_kyc_data')
export class LeadKycData {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    leadId: string;

    @Column()
    kycSessionId: string;

    @Column({ type: 'jsonb', nullable: true })
    extractedData: any;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    faceMatchScore: number;

    @Column({ nullable: true })
    faceMatchStatus: string;

    @Column({ nullable: true })
    frontImageUrl: string;

    @Column({ nullable: true })
    backImageUrl: string;

    @Column({ nullable: true })
    selfieImageUrl: string;

    @CreateDateColumn()
    createdAt: Date;
}