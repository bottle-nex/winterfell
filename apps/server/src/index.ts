import express from 'express';
import http from 'http';
import env from './configs/env';
import cors from 'cors';
import router from './routes';
import init_services from './services/init';
import ServerToOrchestratorQueue from './queue/loader_queue';

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(
    cors({
        origin: '*',
    }),
);

ServerToOrchestratorQueue.get_instance();

app.use('/api/v1', router);
init_services();
server.listen(env.SERVER_PORT, () => {
    console.warn('Server is running on port : ', env.SERVER_PORT);
});
