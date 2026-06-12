import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('lead_extra_data')
export class LeadExtraData {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    leadId: string;

    @Column()
    tenantId: string;

    @Column({ type: 'jsonb' })
    data: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}