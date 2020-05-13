import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, VersionColumn, UpdateDateColumn, Unique, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import bcrypt = require('bcrypt');

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

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  dataVersion: number;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
