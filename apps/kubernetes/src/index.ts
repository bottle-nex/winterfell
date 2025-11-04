import express from 'express';
import { env } from './configs/env.config';
import { logger } from './utils/logger';
import { init_services } from './services/init_services';

const app = express();
app.use(express.json());

init_services();
const PORT = env.KUBERNETES_PORT;

app.listen(PORT);
