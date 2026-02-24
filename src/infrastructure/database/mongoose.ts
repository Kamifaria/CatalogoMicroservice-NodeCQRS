import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/catalogo';

export const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('[MongoDB] Conectado com sucesso');
    } catch (error) {
        console.error('[MongoDB] Erro ao conectar:', error);
        process.exit(1);
    }
};

const produtoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    preco: { type: Number, required: true },
    estoque: { type: Number, required: true },
}, { timestamps: true });

export const ProdutoModel = mongoose.model('Produto', produtoSchema);
