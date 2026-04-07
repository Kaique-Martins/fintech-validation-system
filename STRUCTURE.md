# 📁 Estrutura Completa do Projeto
```
fintech-validation-system/
│
├── 📄 README.md                          # Documentação principal
├── 📄 QUICKSTART.md                      # Guia rápido de início
├── 📄 ARCHITECTURE.md                    # Arquitetura técnica
├── 📄 package.json                       # Workspace root (monorepo)
├── 📄 docker-compose.yml                 # Orquestração Docker
├── 📄 .gitignore                         # Git ignore rules
│
├── 🐳 backend/                           # NestJS Backend
│   ├── 📄 package.json                   # Dependências backend
│   ├── 📄 tsconfig.json                  # TypeScript config
│   ├── 📄 .eslintrc.js                   # ESLint config
│   ├── 📄 .prettierrc                    # Prettier config
│   ├── 📄 Dockerfile                     # Build Docker backend
│   ├── 📄 .env.example                   # Variáveis de ambiente
│   │
│   └── src/
│       ├── main.ts                       # Entry point
│       │   └── NestFactory.create()
│       │   └── CORS setup
│       │   └── Global prefix: /api
│       │
│       ├── app.module.ts                 # Root module
│       │   └── Imports: ValidationModule
│       │
│       └── validation/
│           ├── validation.module.ts      # Feature module
│           │   └── Exports:
│           │       ├── ValidationController
│           │       └── ValidationService
│           │
│           ├── validation.controller.ts  # HTTP endpoints
│           │   ├── POST /validate        # Principal
│           │   ├── GET /info             # Informações
│           │   └── GET /interface        # Interface ASCII
│           │
│           ├── validation.service.ts     # Lógica de validação
│           │   ├── normalize_text()
│           │   ├── standardize_city()
│           │   ├── standardize_category()
│           │   ├── infer_category()
│           │   ├── validate_price()
│           │   └── validate() [Main]
│           │
│           ├── constants/
│           │   └── references.ts         # Dados de referência
│           │       ├── CITIES_MAPPING
│           │       ├── VALID_CATEGORIES
│           │       ├── MARKET_PRICES
│           │       └── CATEGORY_KEYWORDS
│           │
│           └── dto/
│               └── validation.dto.ts     # Data Transfer Objects
│                   ├── ValidationRecordDto
│                   ├── CorrectedDataDto
│                   ├── ValidationStatus
│                   └── ValidationResultDto
│
├── 🎨 frontend/                          # React Frontend
│   ├── 📄 package.json                   # Dependências frontend
│   ├── 📄 tsconfig.json                  # TypeScript config
│   ├── 📄 tsconfig.node.json             # Node TS config
│   ├── 📄 vite.config.ts                 # Vite config + proxy
│   ├── 📄 Dockerfile                     # Build Docker frontend
│   ├── 📄 index.html                     # HTML base
│   ├── 📄 .env.example                   # Variáveis de ambiente
│   │
│   └── src/
│       ├── main.tsx                      # React DOM entry
│       │   └── ReactDOM.createRoot()
│       │
│       ├── App.tsx                       # Componente principal
│       │   ├── Layout com header/footer
│       │   ├── Grid: form + result
│       │   └── State management
│       │
│       ├── components/
│       │   ├── ValidationForm.tsx        # Formulário de entrada
│       │   │   ├── Estado dos campos
│       │   │   ├── Validação frente-end
│       │   │   ├── Botões (Validar/Limpar)
│       │   │   └── Integração com service
│       │   │
│       │   └── ResultDisplay.tsx         # Exibição de resultado
│       │       ├── Interface ASCII
│       │       ├── JSON estruturado
│       │       ├── Status badge
│       │       ├── Motivos de alteração
│       │       └── Dados corrigidos
│       │
│       ├── services/
│       │   └── validationService.ts      # API Client
│       │       ├── axios instance
│       │       ├── validate()
│       │       ├── getInterface()
│       │       └── getInfo()
│       │
│       ├── types/
│       │   └── validation.ts             # TypeScript types
│       │       ├── ValidationRecord
│       │       ├── CorrectedData
│       │       ├── ValidationStatus
│       │       ├── ValidationResult
│       │       └── ApiResponse
│       │
│       └── styles/
│           ├── index.css                 # Estilos globais
│           │   ├── Layout geral
│           │   ├── Temas (gradientes)
│           │   └── Responsividade
│           │
│           ├── ValidationForm.css        # Estilos do form
│           │   ├── Input styling
│           │   ├── Botões customizados
│           │   └── Estados (hover, disabled)
│           │
│           └── ResultDisplay.css         # Estilos de resultado
│               ├── Interface ASCII
│               ├── JSON box
│               ├── Status badges
│               ├── Animações
│               └── Responsividade


═══════════════════════════════════════════════════════════════════

RESUMO ESTRUTURAL

Backend (NestJS):
  - Separação clara de módulos
  - Dependency Injection automático
  - Controllers → Services → Constants
  - Type-safe com TypeScript
  - DTOs para validação

Frontend (React):
  - Componentes reutilizáveis
  - Estado centralizado (useState)
  - Service layer desacoplado
  - Styling modular
  - TypeScript para tipo-segurança

Configuração:
  - package.json root com workspaces
  - ESLint + Prettier (Code quality)
  - Docker setup pronto
  - Environment examples
  - .gitignore configurado

═══════════════════════════════════════════════════════════════════

FLUXO DE DADOS

User Input (Frontend)
    ↓
ValidationForm.tsx (State)
    ↓
validationService.validate()
    ↓
HTTP POST → backend:3001/api/validation/validate
    ↓
Backend receives JSON
    ↓
ValidationController (routing)
    ↓
ValidationService.validate() (main logic)
    ├── normalize & standardize
    ├── impute missing categories
    ├── detect price anomalies
    └── return result
    ↓
HTTP 200 OK ← from backend
    ↓
Frontend receives JSON
    ↓
ResultDisplay.tsx (render)
    ├── Interface ASCII
    ├── JSON viewer
    ├── Status badge
    └── Corrected data


═══════════════════════════════════════════════════════════════════

DEPENDÊNCIAS-CHAVE

Backend:
  @nestjs/common        - Framework core
  @nestjs/core         - Entry point
  @nestjs/platform-express - HTTP
  typescript            - Language
  class-validator       - DTO validation
  class-transformer     - DTO transform

Frontend:
  react               - UI library
  react-dom           - DOM rendering
  axios               - HTTP client
  typescript          - Language
  vite                - Build tool
  @vitejs/plugin-react - React support

═══════════════════════════════════════════════════════════════════

Para adicionar novas categorias/cidades:
  → Editar: backend/src/validation/constants/references.ts
  → Reiniciar backend

Para modificar interface ASCII:
  → Editar: backend/src/validation/validation.service.ts (getValidationInterface)
  → Reiniciar backend

Para customizar UI:
  → Editar: frontend/src/styles/*.css
  → Recarregar navegador (hot reload com Vite)

═══════════════════════════════════════════════════════════════════
```

---

**Arquitetura Production-Ready** ✅
- Código organizado e escalável
- Type-safe com TypeScript
- Fácil de testar e manter
- Pronto para CI/CD
- Preparado para banco de dados
