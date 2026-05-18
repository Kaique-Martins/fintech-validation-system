# 🚀 Guia de Inicialização Rápida

## Passo 1: Instalar Dependências

### Backend
```bash
cd fintech-validation-system/backend
npm install
```

### Frontend
```bash
cd fintech-validation-system/frontend
npm install
```

## Passo 1.1: Configurar Variáveis de Ambiente

Copie os arquivos de exemplo e ajuste os valores conforme o ambiente:

- [frontend/.env.example](frontend/.env.example) -> [frontend/.env](frontend/.env)
- [backend/.env.example](backend/.env.example) -> [backend/.env](backend/.env)

Em produção, ajuste pelo menos:

- `VITE_API_URL` para a URL pública da API
- `CORS_ORIGIN` para o domínio do frontend

## Passo 2: Iniciar os Serviços

### Terminal 1 - Backend
```bash
cd fintech-validation-system/backend
npm run start:dev
```

Você deve ver:
```
[Nest] 12345  - 04/07/2026, 10:30:00 AM   LOG [InstanceLoader] ValidationModule dependencies initialized +5ms
[Nest] 12345  - 04/07/2026, 10:30:00 AM   LOG [RoutesResolver] ValidationController {/api/validation}: true +2ms
FinTech Validation Backend running on http://localhost:3001
```

### Terminal 2 - Frontend
```bash
cd fintech-validation-system/frontend
npm run dev
```

Você deve ver:
```
  VITE v4.3.9  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

## Passo 3: Acessar a Aplicação

Abra seu navegador em: **http://localhost:3000**

## 🧪 Testando a Aplicação

### Teste 1: Validação Simples
1. Preencha o formulário:
   - **Produto:** Notebook Dell XPS
   - **Categoria:** Eletrônicos
   - **Preço:** 3500.00
   - **Cidade:** São Paulo

2. Clique em "🔍 Validar"

3. Resultado esperado: ✅ APROVADO

### Teste 2: Imputação de Categoria
1. Preencha o formulário:
   - **Produto:** iPhone 14 Pro
   - **Categoria:** (deixe vazio)
   - **Preço:** 4200.00
   - **Cidade:** RJ

2. Clique em "🔍 Validar"

3. Resultado esperado: ✅ APROVADO
   - Categoria será inferida como "Eletrônicos"
   - Cidade será corrigida para "Rio de Janeiro"

### Teste 3: Detecção de Anomalia
1. Preencha o formulário:
   - **Produto:** Notebook Samsung
   - **Categoria:** Eletrônicos
   - **Preço:** 0.01
   - **Cidade:** Belo Horizonte

2. Clique em "🔍 Validar"

3. Resultado esperado: 🚨 QUARENTENA
   - Motivo: Preço incompatível com operações financeiras

## 📡 Testando via cURL

### Validar um registro
```bash
curl -X POST http://localhost:3001/api/validation/validate \
  -H "Content-Type: application/json" \
  -d '{
    "produto": "Notebook Dell XPS",
    "categoria": "Eletrônicos",
    "preco": 3500.00,
    "cidade": "São Paulo"
  }'
```

### Obter informações do serviço
```bash
curl http://localhost:3001/api/validation/info
```

### Obter interface ASCII
```bash
curl http://localhost:3001/api/validation/interface
```

## 🐳 Com Docker Compose

```bash
cd fintech-validation-system
docker-compose up --build
```

Acesse:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

## 🛑 Parar os Serviços

### Desenvolvimento Local
- Backend: `Ctrl+C` no terminal 1
- Frontend: `Ctrl+C` no terminal 2

### Docker Compose
```bash
docker-compose down
```

## 📖 Estrutura de Dados

### Request JSON
```json
{
  "produto": "string",           // obrigatório
  "categoria": "string",         // opcional (será inferida se vazia)
  "preco": number,              // obrigatório (> 0)
  "cidade": "string"            // obrigatório
}
```

### Response JSON
```json
{
  "dado_corrigido": {
    "produto": "string",
    "categoria": "string",       // uma das categorias válidas
    "preco": number,
    "cidade": "string"           // padronizado
  },
  "status": "APROVADO|QUARENTENA",
  "motivo": "string"             // explicação das alterações
}
```

## 🎨 Interface Visual da Fintech

Cada validação exibe a interface ASCII:
```
╔════════════════════════════════════════════╗
║      FINTECH DATA QUALITY ENGINE v2.0      ║
╠════════════════════════════════════════════╣
║ Status da Análise: [PROCESSANDO]           ║
║ Origem do Dado: Cadastro de Produto        ║
║ Finalidade: Compliance + Score de Crédito  ║
╚════════════════════════════════════════════╝
```

## 🔧 Troubleshooting

### "Connection refused" no frontend
- Certifique-se que o backend está rodando em `http://localhost:3001`
- Verifique o CORS em `backend/src/main.ts`

### Erro ao acessar `http://localhost:3000`
- Verifique se o frontend está rodando: `npm run dev`
- Tente acessar `http://127.0.0.1:3000`

### Dependências não instaladas
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

## 📚 Leitura Recomendada

- [Backend/src/validation/validation.service.ts](../backend/src/validation/validation.service.ts) - Lógica principal
- [Frontend/src/services/validationService.ts](../frontend/src/services/validationService.ts) - Cliente API
- [README.md](../README.md) - Documentação completa

## 🎯 Próximos Passos

1. ✅ Servidor backend rodando
2. ✅ Interface frontend funcionando
3. 📝 Editar as tabelas de referência (cidades, categorias)
4. 📈 Implementar persistência (banco de dados)
5. 🔐 Adicionar autenticação
6. 📊 Adicionar dashboard de métricas

## 💡 Nota

O projeto está pronto para **desenvolvimento** e **produção**. Para ambientes de produção, considere:
- Adicionar um banco de dados (PostgreSQL/MongoDB)
- Implementar autenticação (JWT/OAuth)
- Adicionar logging estruturado
- Configurar CI/CD
- Adicionar testes automatizados
- Expor a API e o frontend em domínios separados com `VITE_API_URL` e `CORS_ORIGIN`

---

**Pronto para começar!** 🚀
