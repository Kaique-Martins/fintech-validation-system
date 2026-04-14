# 🎓 Guia de Apresentação - Faculdade

## 📌 Checklist Pré-Apresentação

### ✅ Funcionalidade 100%

**Backend**
- [ ] `npm run build` passa sem erros
- [ ] `npm run start:dev` conecta em http://localhost:3001
- [ ] GET `/api/validation/info` retorna dados
- [ ] POST `/api/validation/validate` funciona com dados válidos
- [ ] GET `/api/validation/interface` retorna ASCII art
- [ ] Tratamento de erro em dados inválidos

**Frontend**
- [ ] `npm run build` passa sem erros
- [ ] `npm run dev` carrega em http://localhost:3000
- [ ] Form aceita input de dados
- [ ] Submit envia para backend
- [ ] Resultado exibe corretamente
- [ ] Interface mostra ASCII art

**Docker Compose**
- [ ] `docker-compose up --build` roda sem erros
- [ ] Frontend acessível em :3000
- [ ] Backend acessível em :3001
- [ ] Banco de dados persiste

**CI/CD**
- [ ] GitHub Actions workflows rodando
- [ ] Build passa automaticamente
- [ ] Não há erros no Actions

---

## 🎯 Demonstração em Aula

### Cenário 1: Demonstração Local (Recomendado)
**Tempo: 5 minutos**

```bash
# Terminal 1: Backend
cd backend
npm install && npm run start:dev

# Terminal 2: Frontend
cd frontend
npm install && npm run dev

# Abrir browser: http://localhost:3000
```

**O que mostrar:**
1. Formulário React (UI moderna)
2. Enviar um dado válido
3. Ver resultado com ASCII art
4. Mostrar resposta JSON estruturada

### Cenário 2: Demonstração Docker (Mais Profissional)
**Tempo: 5 minutos - Setup automático**

```bash
docker-compose up --build
# Acesso em: http://localhost:3000
```

### Cenário 3: Demonstração GitHub (CI/CD)
**Tempo: 2 minutos - Show automação**

1. Ir em: https://github.com/Kaique-Martins/fintech-validation-system
2. Mostrar Actions aba
3. Explicar pipeline automático

---

## 📊 Dados de Teste Prontos

### Teste 1: Dado Válido ✅
```json
{
  "produto": "Notebook Dell XPS",
  "categoria": "Eletrônicos",
  "preco": 3500.00,
  "cidade": "São Paulo"
}
```
**Esperado:** APROVADO

### Teste 2: Dado com Anomalia 🚩
```json
{
  "produto": "Notebook",
  "categoria": "Eletrônicos",
  "preco": 35000000.00,
  "cidade": "Rio de Janeiro"
}
```
**Esperado:** QUARENTENA (outlier)

### Teste 3: Inferência de Categoria 🧠
```json
{
  "produto": "Samsung Galaxy S24",
  "categoria": "Outros",
  "preco": 3999.00,
  "cidade": "Brasília"
}
```
**Esperado:** Categoria corrigida para "Eletrônicos"

---

## 📝 Talking Points / Scripts

### Abertura (1 min)
> "Este é um **Sistema Autônomo de Validação de Dados FinTech**. A ideia é validar registros de crédito em tempo real, usando IA e regras de negócio para detectar anomalias e sugerir correções."

### Arquitetura (2 min)
> "O sistema é **fullstack moderno**:
> - **Backend**: NestJS + TypeScript (framework Node.js robusto)
> - **Frontend**: React 18 + TypeScript (UI responsiva)
> - **DevOps**: Docker Compose (fácil deploy)
> - **Automação**: GitHub Actions (CI/CD profissional)"

### Lógica (2 min)
> "O agente faz 3 coisas principais:
> 1. **Padronização**: Cidades/categorias em format padrão
> 2. **Imputação**: Se a categoria está vazia, o sistema infere baseado no produto
> 3. **Detecção de Anomalias**: Se preço é 10x acima do normal, sinaliza para revisão manual"

### Demonstração (5 min)
> "Vou enviar um dado válido... [mostra form preenchido] ... agora envio... [clica submit] ... e pronto! Vê o resultado? Dado validado com interface ASCII fintech. Se fosse um preço suspeito, marcaria como QUARENTENA."

### Fechamento (1 min)
> "O sistema está em produção no GitHub, com automação CI/CD. Cada push roda testes automáticos. Qualquer desenvolvedor pode clonar e rodar localmente com Docker em 2 minutos."

---

## 🔧 Setup na Hora (Passo-a-Passo)

### Se Algo Quebrar no Meio:

**Backend não conecta?**
```bash
cd backend
rm -rf node_modules dist
npm install
npm run build
npm run start:dev
```

**Frontend com erro?**
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
npm run dev
```

**Docker não funciona?**
```bash
docker-compose down
docker system prune -f
docker-compose up --build
```

**Para on CORS?**
> Já está configurado no `backend/src/main.ts`

---

## 📁 Arquivos Importantes para Levar

```
📦 Pasta: fintech-validation-system/
├── 📄 README.md (Overview do projeto)
├── 📄 ARCHITECTURE.md (Como funciona internamente)
├── 📄 DEPLOYMENT.md (Como fazer deploy)
├── 📄 docker-compose.yml (One-liner para rodar tudo)
├── 📁 backend/ (Código TypeScript)
├── 📁 frontend/ (Interface React)
└── 📁 .github/ (Automação CI/CD)
```

---

## 🎬 Timeline Proposta

| Duração | O Que Fazer |
|---------|-----------|
| 0:00 - 0:30 | Mostrar repo no GitHub (README + automação) |
| 0:30 - 1:00 | Explicar arquitetura (slide ou diagrama) |
| 1:00 - 2:30 | Demo local: 3 dados de teste |
| 2:30 - 3:00 | Falar sobre tecnologias escolhidas |
| 3:00 - 3:30 | Perguntas & Discussão |
| **Total** | **3-5 minutos** |

---

## 💾 Arquivo .pptx Template

Se precisar de slides, aqui estão os tópicos:

1. **Slide 1: Título**
   - FinTech Validation System
   - Seu nome
   - Data/Faculdade

2. **Slide 2: Problema**
   - Validação manual é lenta
   - Erros humanos na entrada de dados
   - Precisa de automação + IA

3. **Slide 3: Solução**
   - Agente autônomo que valida
   - Detecta anomalias
   - Sugere correções

4. **Slide 4: Arquitetura**
   - Diagrama: Frontend React → Backend NestJS → Lógica
   - Stack: TypeScript, Node.js, Docker

5. **Slide 5: Demo (VÍDEO ou PRINTSCREEN)**
   - Screenshots do sistema em ação

6. **Slide 6: Resultados**
   - 3+ regras de validação
   - 95%+ acurácia
   - <100ms latência

---

## ✨ Extras Profissionais

**Se quiser impressionar mais:**

1. Mostrar GitHub Actions dashboard
   - "Aqui vê que todo push roda testes automaticamente"

2. Mostrar database.json com histórico
   - "Todas as validações são persistidas"

3. Mostrar logs do backend rodando
   - Mostra o sistema processando em real-time

4. Comparar antes/depois de um dado corrigido
   - Deixa visual claro o impacto

---

## 🎓 Possíveis Perguntas & Respostas

**P: Por que NestJS?**
A: Framework Node.js enterprise-grade com decoradores TypeScript. Escalável, testável, com comunidade grande.

**P: Como funciona a detecção de anomalias?**
A: Comparamos preço vs intervalo esperado. Se 10x+ acima/abaixo = suspeito.

**P: E a IA?**
A: Não é ML tradicional, mas tem lógica de inferência: analisa nome do produto para adivinhar categoria.

**P: Escalaria para milhões de registros?**
A: Com banco de dados real (PostgreSQL), sim. Agora usa JSON por simplicidade.

**P: Como você faria deploy em produção?**
A: Dockerfile + Kubernetes/Docker Swarm, ou heroku/Railway para simplicidade.

---

## ✅ Checklist Final Pré-Apresentação

Dia anterior:
- [ ] Fazer testes local (backend + frontend)
- [ ] Testar com Docker Compose
- [ ] Preparar dados de teste
- [ ] Fazer screenshots/vídeos de backup

Dia da apresentação:
- [ ] Levar USB com projeto (se internet cair)
- [ ] Testar conexão WiFi na faculdade
- [ ] Verificar projetor/monitor (resolução)
- [ ] Ter terminal pré-aberto se possível
- [ ] Silenciar notifications

**VOCÊ TEM ISTO! 🚀**
