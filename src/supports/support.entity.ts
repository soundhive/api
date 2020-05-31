/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'src/users/user.entity';
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('supports')
export class Support {
    constructor(partial: Partial<Support>) {
        Object.assign(this, partial)
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    supportedAt: Date;

    @ManyToOne(type => User, user => user.supporters)
    to: User;

    @ManyToOne(type => User, user => user.supporting)
    from: User;

}

