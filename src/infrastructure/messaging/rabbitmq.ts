import amqp, { Connection, Channel } from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

class RabbitMQConnection {
    private connection!: Connection;
    private channel!: Channel;

    async connect() {
        try {
            this.connection = await amqp.connect(RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            console.log('[RabbitMQ] Conectado com sucesso');
        } catch (error) {
            console.error('[RabbitMQ] Falha ao conectar:', error);
            process.exit(1);
        }
    }

    async publish(exchange: string, routingKey: string, message: any) {
        if (!this.channel) {
            console.error('[RabbitMQ] Canal não estabelecido.');
            return;
        }

        await this.channel.assertExchange(exchange, 'topic', { durable: true });

        this.channel.publish(
            exchange,
            routingKey,
            Buffer.from(JSON.stringify(message))
        );
        console.log(`[RabbitMQ] Mensagem publicada na exchange '${exchange}' com key '${routingKey}'`);
    }
}

export const rabbitmq = new RabbitMQConnection();
