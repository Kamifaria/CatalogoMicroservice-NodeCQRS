# Catalogo Microservice (Node.js & CQRS)

Este é um microsserviço simulando o catálogo de produtos de um e-commerce. O projeto utiliza **Node.js, TypeScript e o padrão CQRS** (Command Query Responsibility Segregation) aliado a uma arquitetura Event-Driven.

## 🚀 Tecnologias

- **Node.js com TypeScript** (Substituindo a antiga base em .NET).
- **Express** (API Gateway / Controllers).
- **Zod** (Validação de Schema no Domínio).
- **Mongoose / MongoDB** (Banco Escrita/Comandos).
- **Redis** (Banco de Leitura Rápida/Queries).
- **RabbitMQ (amqplib)** (Mensageria para arquitetura Event-Driven).
- **Docker & Docker Compose** (Orquestração de ambiente).

## 💎 Padrões Adotados (Design Patterns)

### 1. CQRS (Command Query Responsibility Segregation)
O modelo clássico de CRUD foi dividido em duas responsabilidades apartadas no diretório `src/application`:

* **Commands (`src/application/commands`):** Operações que mudam o estado do sistema (como adicionar produtos). Após uma validação rigorosa de sintaxe/semântica no domínio com `Zod`, os comandos persistem o dado no banco transacional (MongoDB). Exemplo: `CreateProductHandler`.
* **Queries (`src/application/queries`):** Operações feitas estritamente para leitura de dados. Para prover uma listagem veloz, os dados são requisitados primariamente de um cache em memória (Redis). Se não encontrados (Cache Miss), os dados são lidos do MongoDB e cacheados para as próximas chamadas. Exemplo: `GetProductQuery`.

### 2. Event-Driven Architecture (EDA)
Ao invés de criar forte acoplamento (ex: serviço X sempre chama API do serviço Y logo após criar um produto), adota-se o padrão de Mensageria:
Assim que um `CreateProductHandler` insere um produto com sucesso no MongoDB, uma mensagem de `ProductCreated` contendo as informações deste do ID é jogada numa respectiva *Exchange* do RabbitMQ. Quaisquer outros microsserviços interessados nessa criação podem apenas escutar uma fila deste mesmo evento e processar tudo assincronamente (e.g. microsserviço de Busca ou de Inteligência Artifical no e-commerce).

## 🛠️ Como Iniciar com Docker Play

Não é necessário instalar bancos localmente. Basta rodar:

```bash
docker compose up -d --build
```

O compose subirá automaticamente a API na porta `3000`, bem como instâncias de MongoDB, Redis e RabbitMQ conectadas via rede interna.
