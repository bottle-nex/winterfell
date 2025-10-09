import express from 'express';
import cors from 'cors';
import http from 'http';
import router from "./routes/routes";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost3000",
        credentials: true,
    }),
);

app.use('/api/v1', router);

const PORT = 8080;
server.listen(PORT, () => {
    console.warn('Application started at port : ', PORT);
});
