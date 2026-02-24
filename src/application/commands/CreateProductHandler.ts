import { Produto, ProdutoSchema } from '../../domain/Produto';
import { ProdutoRepository } from '../../infrastructure/repositories/ProdutoRepository';
import { rabbitmq } from '../../infrastructure/messaging/rabbitmq';

export class CreateProductHandler {
    constructor(private produtoRepository: ProdutoRepository) { }

    async handle(payload: any): Promise<Produto> {
        // 1. Validar Schema via Zod
        const validatedProduct = ProdutoSchema.parse(payload);

        // 2. Persistir no MongoDB
        const createdProduct = await this.produtoRepository.salvar(validatedProduct);

        // 3. Publicar evento ProductCreated no RabbitMQ
        await rabbitmq.publish('catalog_exchange', 'ProductCreated', {
            produtoId: createdProduct.id,
            timestamp: new Date().toISOString()
        });

        return createdProduct;
    }
}
