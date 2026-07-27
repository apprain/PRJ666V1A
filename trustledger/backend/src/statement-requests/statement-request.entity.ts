import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";


import { StatementShare } from "../statement-shares/statement-share.entity";
import { Organization } from "../organizations/organization.entity";
import { User } from "../users/user.entity";

export enum StatementRequestStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    SHARED = "shared",
    REJECTED = "rejected",
    EXPIRED = "expired",
    CANCELLED = "cancelled",
}

@Entity("statement_requests")
export class StatementRequest {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid" })
    requestingOrganizationId: string;

    @ManyToOne(() => Organization, { nullable: false })
    @JoinColumn({ name: "requestingOrganizationId" })
    requestingOrganization: Organization;

    @Column()
    requestedByUserId: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "requestedByUserId" })
    requestedByUser: User;

    @Column()
    sourceBankName: string;

    @Column({ nullable: true })
    customerName?: string;

    @Column({ nullable: true })
    customerMobile?: string;

    @Column()
    accountNumber: string;

    @Column({ type: "date" })
    startDate: string;

    @Column({ type: "date" })
    endDate: string;

    @Column()
    purpose: string;

    @Column({ type: "text", nullable: true })
    notes?: string;

    @Column({ nullable: true })
    consentDocumentPath?: string;

    @Column({ nullable: true })
    consentDocumentOriginalName?: string;

    @Column({ nullable: true })
    consentDocumentMimeType?: string;

    @Column({
        type: "enum",
        enum: StatementRequestStatus,
        default: StatementRequestStatus.PENDING,
    })
    status: StatementRequestStatus;

    @Column({ type: "timestamp" })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: "int", nullable: true })
    statementShareId?: number;

    @ManyToOne(() => StatementShare, { nullable: true })
    @JoinColumn({ name: "statementShareId" })
    statementShare?: StatementShare;
}