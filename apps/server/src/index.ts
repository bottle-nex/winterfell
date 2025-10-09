import express from 'express';
import http from 'http';
import env from './configs/env';
import cors from 'cors';
import router from './routes';

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(
    cors({
        origin: '*',
    }),
);

app.use('/api/v1', router);

server.listen(env.SERVER_PORT, () => {
    console.log('Server is running on port : ', env.SERVER_PORT);
});
