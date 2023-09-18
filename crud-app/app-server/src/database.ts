import { Column, DataSource, Entity, PrimaryColumn } from "typeorm";

const DB_HOST = 'postgresql://postgres:postgres@crud-db:5432';

@Entity()
export class Result {
  @PrimaryColumn('uuid')
  id: string

  @Column({ type: 'int' })
  flips: number

  @Column({ type: 'int' })
  heads: number

  @Column({ type: 'int' })
  tails: number
}

export const dataSource = new DataSource({ type: 'postgres', url: DB_HOST, entities: [Result], synchronize: true });
