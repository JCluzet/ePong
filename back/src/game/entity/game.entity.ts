import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToMany } from "typeorm";
import { EUser } from 'src/users/interfaces/user.entity'

@Entity('game')
export class EGame {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn({ nullable: true })
    createdAt?: Date;

    @Column({ nullable: true })
    winner_score: number;

    @Column({ nullable: true })
    loser_score: number;

    @Column({ nullable: true })
    loser: number;

    @Column({ nullable: true })
    winner: number;

    @Column({ nullable: true })
    game_mode: number;

    // @ManyToMany(() => EUser, (user) => user.games)
    // players: EUser[]
}