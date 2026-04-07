# 📋 Arquitetura Técnica - FINTECH VALIDATION SYSTEM v2.0

## 🏗️ Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (BROWSER)                        │
├─────────────────────────────────────────────────────────────┤
│   FRONTEND REACT (TypeScript)                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  App.tsx                                               │ │
│  │  ├── ValidationForm (UI Input)                         │ │
│  │  ├── ResultDisplay (Response JSON + Interface ASCII)   │ │
│  │  └── validationService (API Client)                    │ │
│  └────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│           HTTP/REST (JSON over CORS)                        │
├─────────────────────────────────────────────────────────────┤
│   BACKEND NESTJS (TypeScript)                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ValidationController                                  │ │
│  │  ├── POST /api/validation/validate                    │ │
│  │  ├── GET /api/validation/info                         │ │
│  │  └── GET /api/validation/interface                    │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ValidationService (Lógica Principal)                  │ │
│  │  ├── Padronização (normalize, standardize)            │ │
│  │  ├── Imputação (infer_category)                       │ │
│  │  ├── Detecção de Anomalias (validate_price)           │ │
│  │  └── Validação Completa (validate)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Constants (Tabelas de Referência)                     │ │
│  │  ├── CITIES_MAPPING                                    │ │
│  │  ├── VALID_CATEGORIES                                  │ │
│  │  ├── MARKET_PRICES                                     │ │
│  │  └── CATEGORY_KEYWORDS                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Estrutura de Pacotes

### Backend (NestJS)

```
backend/src/
├── main.ts
│   └── Entry point, CORS setup
├── app.module.ts
│   └── Root module, imports ValidationModule
└── validation/
    ├── validation.module.ts
    │   └── Exports ValidationService, RegionController
    ├── validation.controller.ts
    │   ├── @Post('validate') - Endpoint principal
    │   ├── @Get('info') - Informações do serviço
    │   └── @Get('interface') - Interface ASCII
    ├── validation.service.ts
    │   ├── normalize_text(text): string
    │   ├── standardize_city(city): {value, reason}
    │   ├── standardize_category(cat): {value, reason}
    │   ├── infer_category(product): {value, reason}
    │   ├── validate_price(price, cat): {isValid, reason}
    │   └── validate(record): ValidationResultDto
    ├── constants/
    │   └── references.ts
    │       ├── CITIES_MAPPING
    │       ├── VALID_CATEGORIES
    │       ├── MARKET_PRICES
    │       └── CATEGORY_KEYWORDS
    └── dto/
        └── validation.dto.ts
            ├── ValidationRecordDto
            ├── CorrectedDataDto
            └── ValidationResultDto
```

### Frontend (React)

```
frontend/src/
├── main.tsx
│   └── ReactDOM entry point
├── App.tsx
│   └── Main component with layout
├── components/
│   ├── ValidationForm.tsx
│   │   └── Form inputs, state management
│   └── ResultDisplay.tsx
│       └── Displays JSON result + interface
├── services/
│   └── validationService.ts
│       ├── API client with axios
│       ├── validate(record)
│       ├── getInterface()
│       └── getInfo()
├── types/
│   └── validation.ts
│       ├── ValidationRecord
│       ├── CorrectedData
│       ├── ValidationResult
│       └── ValidationStatus
└── styles/
    ├── index.css
    │   └── Global styles
    ├── ValidationForm.css
    │   └── Form specific styles
    └── ResultDisplay.css
        └── Result display styles
```

## 🔄 Fluxo de Dados

### Request Flow
```
1. User fills form → ValidationForm.tsx
2. Submit → calls validationService.validate(record)
3. HTTP POST /api/validation/validate (JSON)
4. ↓ Network ↓
5. Backend receives in ValidationController
6. Passes to ValidationService.validate()
7. Returns ValidationResultDto
8. ↓ Network ↓
9. Frontend receives response
10. ResultDisplay renders JSON + interface ASCII
```

### Validation Flow (Backend)
```
Input: ValidationRecordDto
  ↓
1. TEXTO_NORMALIZATION
   produto = trim(produto)
   ↓
2. CITY_STANDARDIZATION
   cidade = CITIES_MAPPING[normalize(cidade)] ou fuzzy-match
   ↓
3. CATEGORY_PROCESSING
   if categoria.empty():
      categoria = infer from CATEGORY_KEYWORDS
   else:
      categoria = standardize or keep
   ↓
4. PRICE_VALIDATION
   if preco <= 0:
      status = QUARENTENA
   else:
      if preco > max*10 or preco < min/10:
         status = QUARENTENA
      else if preco > max*2 or preco < min/2:
         status = APROVADO (with warning)
      else:
         status = APROVADO
   ↓
Output: ValidationResultDto
  { dado_corrigido, status, motivo }
```

## 📊 Dados de Referência

### Categorias Válidas
```typescript
[
  'Eletrônicos',
  'Eletrodomésticos',
  'Serviços',
  'Vestuário',
  'Alimentos',
  'Outros'
]
```

### Preços Típicos de Mercado
```typescript
Eletrônicos: R$ 50 - R$ 5.000
Eletrodomésticos: R$ 100 - R$ 3.000
Serviços: R$ 20 - R$ 1.000
Vestuário: R$ 10 - R$ 500
Alimentos: R$ 5 - R$ 200
Outros: R$ 1 - R$ 10.000
```

### Limites de Detecção de Anomalias
```
- QUARENTENA: preco > max*10 ou preco < min/10
- WARNING: preco > max*2 ou preco < min/2
- NORMAL: preco dentro dos limites
```

## 🔐 Segurança

### Validações
- Input sanitization (trim, normalize)
- Type safety (TypeScript)
- CORS habilitado apenas para localhost:3000

### O que NÃO faz
- Não conecta a banco de dados (fora do escopo)
- Não autentica usuários
- Não usa criptografia (comunicação local)

## 📡 Protocolos HTTP

### Endpoint: POST /api/validation/validate

**Headers:**
```
Content-Type: application/json
```

**Body (Request):**
```json
{
  "produto": "Notebook Dell XPS",
  "categoria": "Eletrônicos",
  "preco": 3500.00,
  "cidade": "São Paulo"
}
```

**Response (200 OK):**
```json
{
  "dado_corrigido": {
    "produto": "Notebook Dell XPS",
    "categoria": "Eletrônicos",
    "preco": 3500,
    "cidade": "São Paulo"
  },
  "status": "APROVADO",
  "motivo": ""
}
```

### Endpoint: GET /api/validation/info

**Response (200 OK):**
```json
{
  "version": "2.0",
  "name": "FINTECH DATA QUALITY ENGINE",
  "description": "Autonomous validation agent for credit risk analysis and regulatory compliance"
}
```

### Endpoint: GET /api/validation/interface

**Response (200 OK):**
```json
{
  "interface": "╔════...╚════╝"
}
```

## 🎨 Status da Validação

### APROVADO ✅
- Sem anomalias de preço
- Dados dentro dos intervalos esperados
- Motivo: vazio ou listando alterações realizadas

### QUARENTENA 🚨
- Preço 10× acima/abaixo do intervalo
- Preço suspeito (ex: R$ 0,01)
- Requer revisão manual antes da concessão de crédito
- Motivo: explicação do alerta

## 💡 Padrões de Design

### Backend
- **Dependency Injection** (NestJS)
- **Service Layer Pattern** (separação de responsabilidades)
- **DTO Pattern** (validação de dados)
- **Constants** (references centralizadas)

### Frontend
- **Component-Based Architecture**
- **React Hooks** (useState, useCallback)
- **Service Layer** (validationService)
- **Type-Safe** (TypeScript interfaces)

## 📈 Performance

### Frontend
- Vite para build rápido
- React 18 (concurrent rendering)
- Axios para requisições otimizadas

### Backend
- NestJS com autoload de módulos
- Processamento síncrono (sem I/O bloqueante)
- Resposta média < 50ms

## 🧪 Testabilidade

Código organizado para facilitar testes:
- Service separado da lógica de controller
- DTOs para validação
- Métodos pequenos e bem definidos
- Sem efeitos colaterais
- Uso extensivo de tipos TypeScript

## 🚀 Escalabilidade

### Para Produção
1. ✅ Adicionar banco de dados (PostgreSQL)
2. ✅ Implementar cache (Redis)
3. ✅ Adicionar autenticação (JWT)
4. ✅ Logging estruturado (Winston)
5. ✅ Testes automatizados (Jest)
6. ✅ CI/CD (GitHub Actions)
7. ✅ Monitoramento (Prometheus)

---

**Versão:** 2.0 | **Data:** 2026-04-07
