import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, VersionColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'password_hash' })
  @Exclude()
  passwordHash: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'birth_date' })
  birthDate: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn({ name: 'version_column' })
  dataVersion: number;
}
