# 🚀 Quick Start Guide - FinTech Validation System

## **5 Minutos para Rodar Tudo**

### **Opção A: Docker Compose (MAIS FÁCIL)**

```bash
# 1. Entrar no diretório do projeto
cd fintech-validation-system

# 2. Rodar tudo
docker-compose up --build

# 3. Aguardar os logs aparecerem...
# ✅ Frontend disponível: http://localhost:3000
# ✅ Backend disponível: http://localhost:3001
```

**Pronto!** Abra o navegador em `http://localhost:3000`

---

### **Opção B: Local (Para Desenvolvimento)**

#### **Terminal 1 - Backend**
```bash
cd fintech-validation-system/backend
npm install
npm run start:dev
```

**Deve aparecer:**
```
[NestFactory] Starting Nest application...
[InstanceLoader] AppModule dependencies initialized
[RoutesResolver] AppModule routes (13): ...
Listening on port 3001
```

#### **Terminal 2 - Frontend**
```bash
cd fintech-validation-system/frontend
npm install
npm run dev
```

**Deve aparecer:**
```
  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

---

## **O Que Fazer Agora?**

### 1️⃣ **Testar Validação**
1. Abra http://localhost:3000
2. Na seção "Validador", preencha:
   - Produto: `Notebook Dell XPS`
   - Preço: `3500.00`
   - Cidade: `São Paulo`
3. Clique em "🔍 Validar"

### 2️⃣ **Ver Histórico**
- Clique em "📊 Histórico" para ver decisões anteriores
- Filtre por tipo de decisão (APROVADO/REJEITADO)

### 3️⃣ **Rodar Demo Automático**
- Clique em "🎮 Demo" para simular 50 validações
- Observe métricas atualizarem em tempo real

### 4️⃣ **Analisar Aprendizado**
- Clique em "🧠 Agent Control"
- Veja "Learning Insights" com anomalias detectadas

### 5️⃣ **Importar CSV**
- Clique em "📁 Importar"
- Selecione arquivo com colunas: `produto, preco, cidade`

---

## **Dados de Teste**

### Validações Individuais
```
Cenário 1 - Válido:
  Produto: Notebook Dell XPS
  Preço: 3500.00
  Cidade: São Paulo
  → Resultado: APROVADO ✅

Cenário 2 - Suspeito:
  Produto: Mouse Logitech
  Preço: 35000.00  (muito alto)
  Cidade: RJ
  → Resultado: REJEITADO ⚠️

Cenário 3 - Sem categoria:
  Produto: iPhone 15 Pro
  Preço: 7999.00
  Cidade: Brasília
  → Resultado: AUTO-CATEGORIZADO + APROVADO ✅
```

### CSV Batch (criar arquivo `test.csv`)
```csv
produto,preco,cidade
Notebook Dell,3500.00,São Paulo
Monitor Samsung,1200.00,Rio de Janeiro
Teclado Mecânico,550.00,Belo Horizonte
```

---

## **Endpoints da API**

### Testar via cURL

```bash
# Validação única
curl -X POST http://localhost:3001/api/validation/validate \
  -H "Content-Type: application/json" \
  -d '{
    "produto": "Notebook Dell",
    "preco": 3500.00,
    "cidade": "São Paulo"
  }'

# Métricas do Agent
curl http://localhost:3001/api/agent/metrics

# Histórico
curl http://localhost:3001/api/agent/history/persisted

# Learning insights
curl http://localhost:3001/api/agent/learning/analyze
```

---

## **Troubleshooting Rápido**

| Problema | Solução |
|----------|---------|
| Porta 3000 em uso | `lsof -i :3000` → `kill -9 <PID>` |
| Porta 3001 em uso | `lsof -i :3001` → `kill -9 <PID>` |
| npm não encontrado | Instale Node.js 18+ |
| Docker error | `docker system prune` → retry |
| API não responde | Espere backend inicializar (30s) |
| Dados não salvam | Verifique `backend/data/` existe |

---

## **Arquivos Importantes**

```
fintech-validation-system/
├── FINAL_DOCUMENTATION.md   ← Documentação completa
├── docker-compose.yml       ← Config Docker
├── backend/
│   ├── src/
│   │   ├── agent/          ← Autonomous decision engine
│   │   ├── validation/     ← Validation logic
│   │   └── database/       ← Data persistence
│   └── data/               ← JSON storage (criado auto)
└── frontend/
    └── src/
        └── components/     ← UI components
```

---

## **Modo Demo**

O sistema vem com um **demo pré-configurado**:

1. Clique em "🎮 Iniciar Demo"
2. Sistema simula 50 validações com cenários realistas
3. Atualiza dashboard a cada 2 segundos
4. Mostra métricas em tempo real

**Útil para:** Demonstrações e apresentações

---

## **Export de Dados**

### CSV
```bash
curl http://localhost:3001/api/agent/history/export/csv > report.csv
```

### JSON
Disponível via UI: Dashboard → "📥 Exportar Relatório"

---

## **Performance**

- ⚡ API response: < 200ms
- ⚡ Frontend build: < 5s
- ⚡ Docker build: < 2 min
- ⚡ Memory usage: < 200MB

---

## **Próximos Passos**

1. ✅ Sistema rodando?
2. ✅ Testou validação?
3. ✅ Viu histórico?
4. ✅ Rodar demo?

**Se tudo ok:** Sistema está 100% funcional! 🎉

---

## **Suporte**

Referir para documentação completa:
- `FINAL_DOCUMENTATION.md` - Tudo em detalhes
- `ARCHITECTURE.md` - Design system
- `DEVELOPER_GUIDE.md` - Setup dev

---

**Enjoy! 🚀**
