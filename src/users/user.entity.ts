/* eslint-disable @typescript-eslint/no-unused-vars */
import { Exclude } from 'class-transformer';
import { Album } from 'src/albums/album.entity';
import { Listening } from 'src/listenings/listening.entity';
import { Follow } from 'src/follows/follow.entity';
import { Track } from 'src/tracks/track.entity';
import { Sample } from 'src/samples/samples.entity';
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';

import argon2 = require('argon2');

@Entity('users')
@Unique(['username', 'email'])
export class User {
    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    email: string;

    @OneToMany((type) => Listening, (listening) => listening.user)
    listenings: Listening[];

    @OneToMany((type) => Track, (track) => track.user)
    tracks: Track[];

    @OneToMany((type) => Album, (album) => album.user)
    albums: Album[];

    @OneToMany((type) => Sample, (sample) => sample.user)
    samples: Sample[];

    @OneToMany((type) => Follow, (follow) => follow.to)
    followings: Follow[];

    @OneToMany((type) => Follow, (follow) => follow.from)
    followers: Follow[];

    @Column({ default: true })
    isActive: boolean;

    @Exclude()
    @CreateDateColumn()
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn()
    updatedAt: Date;

    @Exclude()
    @VersionColumn()
    dataVersion: number;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }
}
