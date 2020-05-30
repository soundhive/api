import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from 'src/users/user.entity';

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

