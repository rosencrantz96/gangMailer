import express, { Express } from 'express';
import cors from 'cors';

const app: Express = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: false }));

app.listen(8081, () => {
  console.log('Sever Opened');
});
