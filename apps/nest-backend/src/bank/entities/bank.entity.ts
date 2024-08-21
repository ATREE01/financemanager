import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Currency } from '@/src/currency/entities/currency.entity';
import { IncExpRecord } from '@/src/inc-exp/entities/inc-exp-record.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('Banks')
@Unique(['name', 'user'])
export class Bank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Currency, (currency) => currency.bank)
  currency: Currency;

  @ManyToOne(() => User, (user) => user.bank, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user?: User;

  @OneToMany(() => IncExpRecord, (incExpRecord) => incExpRecord.bank)
  incExpRecords?: IncExpRecord[];
}