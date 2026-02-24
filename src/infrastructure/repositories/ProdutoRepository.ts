import { Produto } from '../../domain/Produto';
import { ProdutoModel } from '../database/mongoose';
import { redisClient } from '../cache/redis';

export class ProdutoRepository {
    async salvar(produto: Omit<Produto, 'id'>): Promise<Produto> {
        const produtoSalvo = await ProdutoModel.create(produto);

        // Invalida cache de lista, caso exista (exemplo de estratégia de cache)
        await redisClient.del('produtos:todos');

        return {
            id: produtoSalvo._id.toString(),
            nome: produtoSalvo.nome,
            descricao: produtoSalvo.descricao,
            preco: produtoSalvo.preco,
            estoque: produtoSalvo.estoque
        };
    }

    async obterPorId(id: string): Promise<Produto | null> {
        const cacheKey = `produto:${id}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            console.log(`[Redis] Produto recuperado do cache: ${id}`);
            return JSON.parse(cached) as Produto;
        }

        const produtoEncontrado = await ProdutoModel.findById(id);

        if (!produtoEncontrado) return null;

        const produto: Produto = {
            id: produtoEncontrado._id.toString(),
            nome: produtoEncontrado.nome,
            descricao: produtoEncontrado.descricao,
            preco: produtoEncontrado.preco,
            estoque: produtoEncontrado.estoque
        };

        // Salva no cache por 1 hora (3600 segundos)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(produto));
        console.log(`[MongoDB] Produto lido da base e salvo no cache: ${id}`);

        return produto;
    }
}
