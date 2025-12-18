import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  // Admin who created this brand
  @ManyToOne(() => User, (user) => user.createdBrands, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  // Brand has many users
  @OneToMany(() => User, (user) => user.brand)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
