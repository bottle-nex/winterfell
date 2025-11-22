import './opentelemtry/instrumentation';

import express from 'express';
import http from 'http';
import env from './configs/config.env';
import cors from 'cors';
import router from './routes';
import init_services from './services/init';
import { loggingMiddleware } from './middlewares/middleware.logger';
import { logger } from './utils/logger';
import Agent from './generator/tools/agent';
// import Agent from './generator/tools/agent';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(loggingMiddleware);
app.use(
    cors({
        origin: '*',
    }),
);

app.use('/api/v1', router);

init_services();

server.listen(env.SERVER_PORT, () => {
    console.warn('Server is running on port : ', env.SERVER_PORT);
});

process.on('SIGINT', () => {
    logger.info('Shutting down server gracefully...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

const trial = () => {
    const agent = new Agent();
    agent.final_call();
}

// setTimeout(trial, 1000);
