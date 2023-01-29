import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  isPrivate: boolean;
  @Column({ nullable: true })
  isDirectConv: boolean;
  @Column({ nullable: true })
  password: string;
}

@Entity('chat_user')
export class ChatUser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  chatId: number;
  @Column({ nullable: true })
  userName: string;
  @Column({ nullable: true })
  userType: number;
}