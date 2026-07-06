import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('statement_shares')
export class StatementShare {
    @PrimaryGeneratedColumn()
    id: number;

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