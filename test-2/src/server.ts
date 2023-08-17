import express from 'express';
import 'reflect-metadata';
import { Column, DataSource, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

const app = express();

const PORT = 3000;
const DOMAIN = "server";
const DB_HOST = process.env.DB_HOST;

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

@Entity()
export class Result {
  @PrimaryColumn('uuid')
  id: string

  @Column()
  value: number
}

const dataSource = new DataSource({ type: 'postgres', url: DB_HOST, entities: [Result], synchronize: true });

router.post('/create', async (req, res) => {
  const id = uuid();
  const value = Math.floor(Math.random() * 100) + 1; // random number between 1 and 100
  const entity = dataSource.manager.create(Result, { id, value });
  await dataSource.manager.save(entity);
  console.log('created entity', id, value);
  res.status(200).json({ success: true, result: { id, value } });
});

app.use(`/${DOMAIN}`, router);

app.listen(PORT, async () => {
  console.log(`App Server listening on port ${PORT}`);
  await dataSource.initialize();
  console.log(`Connected to DB on ${DB_HOST}`);
});