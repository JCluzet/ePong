import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('message')
export class Message {
    @PrimaryGeneratedColumn()
    id: Number;
    @Column({ nullable: true })
    chanId: Number;
    @Column({ nullable: true })
    senderId: Number;
    @Column({ nullable: true })
    content: String;
    @Column({ nullable: true })
    timestamp: String;
}

export type MessageModel = {
    id: Number;
    chanId: Number;
    senderId: Number;
    content: String;
    timestamp: String;
}