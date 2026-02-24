import 'dotenv/config';
import express from 'express';
import { connectDatabase } from '../infrastructure/database/mongoose';
import { connectRedis } from '../infrastructure/cache/redis';
import { rabbitmq } from '../infrastructure/messaging/rabbitmq';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Catalogo Microservice CQRS' });
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
