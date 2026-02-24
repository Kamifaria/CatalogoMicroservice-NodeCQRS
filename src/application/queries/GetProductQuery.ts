import { Produto } from '../../domain/Produto';
import { ProdutoRepository } from '../../infrastructure/repositories/ProdutoRepository';

export class GetProductQuery {
    constructor(private produtoRepository: ProdutoRepository) { }

    async handle(id: string): Promise<Produto | null> {
        // Tenta primeiro o Redis e, se falhar, vai ao MongoDB
        return await this.produtoRepository.obterPorId(id);
    }
}
