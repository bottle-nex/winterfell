import express from 'express';
import http from 'http';
import env from './configs/config.env';
import cors from 'cors';
import router from './routes';
import init_services, { contract_services } from './services/init';

const app = express();
const server = http.createServer(app);

app.use(express.json());
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

const caller = async () => {
    const result = await contract_services.generate_contract(
        'build a todo contract with only add todo function.',
    );
    console.log('----------------------- the plan');
    console.log(result.plan);
    console.log('----------------------- the code');
    console.log(result.coder_output);
    console.log('----------------------IGNORE THIS FOR NOW----------------------');
};

setTimeout(caller, 1000);
