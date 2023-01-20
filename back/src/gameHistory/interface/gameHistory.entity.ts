import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gameHistory')
export class EGameHistory {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  winner: string;

  @Column()
  loser: string;

  @Column()
  winnerScore: number;

  @Column()
  loserScore: number;

  @Column()
  type: string;

  @Column()
  timeStamp: string;
}
