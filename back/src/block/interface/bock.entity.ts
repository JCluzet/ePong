import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('block')
export class EBlock {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @Column()
  status: 'none' | 'blocked';
}
