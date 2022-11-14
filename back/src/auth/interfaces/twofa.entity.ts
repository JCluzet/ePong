import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('twofa')
export class Etwofa {
  @PrimaryColumn()
  login: string;

  @Column()
  code: string;

  @Column()
  expirationDate: Date;
}
