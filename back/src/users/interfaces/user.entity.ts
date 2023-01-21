import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Trole } from './role.type';

@Entity('users')
export class EUser {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  login: string;

  @Column()
  name: string;

  @Column()
  role: Trole;

  @Column()
  nbWins: number;

  @Column()
  nbLoses: number;

  @Column()
  isTwoFa?: boolean;

  @Column()
  avatarUrl: string;

  @Column({ nullable: true, default: "offline" })
  status: string;

  @Column({ nullable: true, default: 0 })
  total_games: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 2, default: 0 })
  win_loss_ratio: number;

  @Column({ nullable: true})
  userType?: number;

}
