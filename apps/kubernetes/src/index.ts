import express from 'express';
import { env } from './configs/env.config';

const PORT = env.KUBERNETES_PORT;

const app = express();
app.use(express.json());

app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`)
});