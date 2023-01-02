import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: Number;
  @Column({ nullable: true })
  chanId: Number;
  @Column({ nullable: true })
  senderId: string;
  @Column({ nullable: true })
  content: string;
  @Column({ nullable: true })
  timestamp: string;
}

export type MessageModel = {
  id: Number;
  chanId: Number;
  senderName: string;
  content: string;
  timestamp: string;
};
