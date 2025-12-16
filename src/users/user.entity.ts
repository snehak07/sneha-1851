import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BRAND,
  })
  role: UserRole;
}
