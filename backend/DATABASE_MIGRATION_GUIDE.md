# Repository Pattern - Database Migration Guide

## Overview

O sistema implementa o **Repository Pattern** para permitir troca de implementações de persistência sem alterar o código da aplicação.

### Camadas

```
┌─────────────────────────┐
│   Application Services  │
│  (AgentService, etc)    │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│   DatabaseService       │
│   (Repository Factory)  │
└────────────┬────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌─────▼──────┐
│  JSON  │      │  Database  │
│Repo    │      │  Repo      │
└────────┘      └────────────┘
```

## Estrutura de Arquivos

```
src/database/
├── interfaces/
│   └── repository.interface.ts      # Interface IRepository (contrato)
├── repositories/
│   ├── json.repository.ts           # ✅ Implementação JSON (ativa)
│   ├── database.repository.ts       # 📝 Stub para banco de dados
│   └── repository.factory.ts        # Factory pattern
├── database.service.ts              # Service que usa factory
├── decision.schema.ts               # Types antigos (backward compat)
└── index.ts                         # Barrel export
```

## Como Funciona Atualmente

### 1. DatabaseService usa RepositoryFactory

```typescript
// database.service.ts
export class DatabaseService {
  private repository: IRepository;

  constructor() {
    // Auto-detecta: JSON se não houver DATABASE_URL
    this.repository = RepositoryFactory.create('auto');
  }
}
```

### 2. Todos os serviços usam DatabaseService

```typescript
// agent.service.ts
constructor(private dbService: DatabaseService) {}

async makeDecision(data: any) {
  const decision = await this.dbService.saveDecision({...});
  return decision;
}
```

## Como Implementar Banco de Dados

### Passo 1: Configurar Variáveis de Ambiente

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/fintech
REPOSITORY_TYPE=database  # ou deixe 'auto' e confie no DATABASE_URL
```

### Passo 2: Implementar DatabaseRepository

Escolha uma das opções:

#### Opção A: Prisma (Recomendado)

```bash
npm install @prisma/client prisma
```

Criar `prisma/schema.prisma`:
```prisma
model Decision {
  id        String   @id
  recordId  String
  decision  String
  confidence Float
  rulesApplied String[]
  reasoning String
  timestamp DateTime
  isAuto    Boolean
  processingTimeMs Int
  agentVersion String
  qualityScore Float
  status    String
  
  @@index([timestamp])
  @@index([decision])
}

model DecisionAggregate {
  id String @id @default(cuid())
  totalDecisions Int
  approvedCount Int
  rejectedCount Int
  flaggedCount Int
  avgConfidence Float
  avgQualityScore Float
  lastUpdate DateTime @updatedAt
}
```

Implementar no `database.repository.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

export class DatabaseRepository implements IRepository {
  private prisma = new PrismaClient();

  async saveDecision(decision: PersistedDecision): Promise<void> {
    await this.prisma.decision.create({ data: decision });
  }

  async getAllDecisions(query?: RepositoryQuery): Promise<PersistedDecision[]> {
    return await this.prisma.decision.findMany({
      where: {
        decision: query?.decision,
        confidence: { gte: query?.confidenceMin, lte: query?.confidenceMax },
        timestamp: { 
          gte: query?.startDate ? new Date(query.startDate) : undefined,
          lte: query?.endDate ? new Date(query.endDate) : undefined,
        }
      },
      take: query?.limit,
      skip: query?.offset,
    });
  }

  // ... implementar outros métodos
}
```

#### Opção B: TypeORM

```bash
npm install typeorm @nestjs/typeorm
```

Criar entidades e implementar repository...

#### Opção C: MongoDB + Mongoose

```bash
npm install mongoose
```

Implementar com Mongoose schemas...

### Passo 3: Ativar no Factory

```typescript
// repository.factory.ts
const env = process.env.REPOSITORY_TYPE || (process.env.DATABASE_URL ? 'database' : 'json');

if (type === 'database') {
  return new DatabaseRepository();  // Agora funciona!
}
```

### Passo 4: Testar

```bash
# Manter em JSON (atual)
npm run start:dev

# Testar com PostgreSQL
DATABASE_URL=postgresql://... npm run start:dev
```

## Suporte a Múltiplas Implementações

Você pode implementar múltiplas repositories e usar um switch:

```typescript
// repository.factory.ts
export class RepositoryFactory {
  static create(type: 'json' | 'postgres' | 'mongodb' | 'auto'): IRepository {
    switch(type) {
      case 'postgres': return new PostgresRepository();
      case 'mongodb': return new MongoRepository();
      case 'json': return new JsonRepository();
      case 'auto': return new JsonRepository(); // fallback
    }
  }
}
```

## Migrations

Se usar banco de dados com schema rígido (PostgreSQL, MySQL):

```bash
# Prisma
npx prisma migrate dev --name initial

# TypeORM
npm run typeorm migration:generate
npm run typeorm migration:run
```

## Rollback Seguro

Para voltar para JSON depois de usar banco:

```typescript
// repository.factory.ts
const type = process.env.REPOSITORY_TYPE || 'json';
return RepositoryFactory.create(type as any);
```

## Performance

| Implementation | Pros | Cons |
|---|---|---|
| **JSON** | ✅ Zero config, desenvolvimento rápido | ❌ Lento com >100k records, sem query otimizado |
| **PostgreSQL** | ✅ Escalável, queries poderosas, ACID | ⚠️ Setup mais complexo |
| **MongoDB** | ✅ Schema flexível, rápido para reads | ⚠️ Menos ACID, menos relações |
| **Firebase** | ✅ Serverless, escalável automaticamente | ❌ Vendor lock-in |

## Testing

Para testar sem banco real:

```typescript
// Criar MockRepository para testes
export class MockRepository implements IRepository {
  private data: PersistedDecision[] = [];

  async saveDecision(decision: PersistedDecision): Promise<void> {
    this.data.push(decision);
  }
  // ...
}

// Usar em testes
const repo = new MockRepository();
const dbService = new DatabaseService_WithDependencyInjection(repo);
```

## Checklist de Implementação

- [ ] Escolher banco de dados
- [ ] Instalar dependências (Prisma, TypeORM, etc)
- [ ] Criar schema/models
- [ ] Implementar DatabaseRepository
- [ ] Implementar todos os 11 métodos da interface
- [ ] Testar queries e migrations
- [ ] Adicionar health check
- [ ] Documentar string de conexão
- [ ] Fazer backup de dados JSON (se migrar)
- [ ] Deploy com nova connection string

## Suporte

Cada repositório precisa implementar 11 métodos obrigatórios:

✅ Decision Persistence (5):
- `saveDecision()`
- `getDecision(id)`
- `getAllDecisions(query?)`
- `getDecisionsByDateRange()`
- `getDecisionsByRule()`

✅ Aggregates (2):
- `getAggregate()`
- `updateAggregate()`

✅ Reporting (2):
- `getDecisionTrends()`
- `exportCSV()`

✅ Utilities (2):
- `clear()`
- `health()`

---

**Status Atual**: ✅ JSON ativa | 📝 Database pronto para implementação

Para começar com banco de dados, descomente os TODOs em `database.repository.ts` e siga o padrão da `JsonRepository` como referência.
