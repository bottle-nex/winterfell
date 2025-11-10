import express from 'express';
import { env } from './configs/env.config';
import Services from './services/init.services';

const PORT = env.KUBERNETES_PORT;
export const kubernetes_services = new Services();
const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
