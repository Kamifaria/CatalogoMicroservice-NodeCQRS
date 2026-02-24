import { z } from 'zod';

export const ProdutoSchema = z.object({
    id: z.string().optional(),
    nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    descricao: z.string().min(10, "A descrição deve ter no mínimo 10 caracteres"),
    preco: z.number().positive("O preço deve ser maior que zero"),
    estoque: z.number().int().nonnegative("O estoque não pode ser negativo"),
});

export type Produto = z.infer<typeof ProdutoSchema>;
