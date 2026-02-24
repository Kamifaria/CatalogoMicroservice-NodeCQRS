import 'dotenv/config';
import express from 'express';
import { connectDatabase } from '../infrastructure/database/mongoose';
import { connectRedis } from '../infrastructure/cache/redis';
import { rabbitmq } from '../infrastructure/messaging/rabbitmq';
import morgan from 'morgan';
import * as promClient from 'prom-client';

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });

const app = express();
app.use(express.json());
app.use(morgan('combined'));

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Catalogo Microservice CQRS' });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

async function startServer() {
    console.log('[API] Inicializando dependências...');
    await connectDatabase();
    await connectRedis();
    await rabbitmq.connect();

    app.listen(PORT, () => {
        console.log(`[API] Servidor online e escutando na porta ${PORT}`);
    });
}

startServer();
