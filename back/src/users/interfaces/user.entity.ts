import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Trole } from './role.type';

@Entity('users')
export class EUser {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  login: string;

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
}
