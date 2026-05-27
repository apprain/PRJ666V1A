import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { ClientApp } from '../client-app/client-app.entity';

@Entity('client_admin_users')
export class ClientAdminUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ClientApp)
    clientApp: ClientApp;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ default: 'owner' })
    role: string;

    @Column({ default: 'active' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}