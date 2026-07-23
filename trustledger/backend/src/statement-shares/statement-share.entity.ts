import { Organization } from "../organizations/organization.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";


@Entity('statement_shares')
export class StatementShare {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid", nullable: true })
    organizationId?: string;

    @ManyToOne(() => Organization, { nullable: true })
    @JoinColumn({ name: "organizationId" })
    organization?: Organization;

    @Column()
    bankName: string;

    @Column()
    accountNumber: string;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;

    @Column({ unique: true })
    token: string;

    @Column({ default: 'active' })
    status: string;

    @Column({ type: 'date' })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    userId: number;

    @Column()
    attemptsRemain: number;
}