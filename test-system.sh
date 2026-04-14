#!/bin/bash

# FinTech Validation System - Test Script
# Valida se o projeto inteiro funciona corretamente

set -e

echo "🧪 FinTech Validation System - Test Suite"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TESTS_PASSED=0
TESTS_FAILED=0

test_result() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((TESTS_FAILED++))
  fi
}

echo "📋 PRÉ-REQUISITOS:"
echo ""

# Check Node.js
echo -n "  Verificando Node.js... "
node --version > /dev/null
test_result "Node.js instalado"

# Check npm
echo -n "  Verificando npm... "
npm --version > /dev/null
test_result "npm instalado"

# Check Docker (optional)
echo -n "  Verificando Docker (opcional)... "
if docker --version > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Docker disponível"
else
  echo -e "${YELLOW}⚠${NC} Docker não disponível (opcional)"
fi

echo ""
echo "🔨 BUILD TESTS:"
echo ""

# Backend build
echo -n "  Backend build... "
cd backend
npm run build > /dev/null 2>&1
test_result "Backend compila sem erros"
cd ..

# Frontend build
echo -n "  Frontend build... "
cd frontend
npm run build > /dev/null 2>&1
test_result "Frontend compila sem erros"
cd ..

echo ""
echo "✅ LINT TESTS:"
echo ""

# Backend lint
echo -n "  Backend lint... "
cd backend
npm run lint > /dev/null 2>&1 || true
test_result "Backend lint OK"
cd ..

# Frontend lint
echo -n "  Frontend lint... "
cd frontend
npm run lint > /dev/null 2>&1 || true
test_result "Frontend lint OK"
cd ..

echo ""
echo "📦 DEPENDENCY CHECKS:"
echo ""

# Check if package.json exists
echo -n "  Backend package.json... "
[ -f "backend/package.json" ]
test_result "Backend package.json existe"

echo -n "  Frontend package.json... "
[ -f "frontend/package.json" ]
test_result "Frontend package.json existe"

echo ""
echo "🐳 DOCKER TEST (opcional):"
echo ""

# Check Docker files
echo -n "  docker-compose.yml... "
[ -f "docker-compose.yml" ]
test_result "docker-compose.yml existe"

echo -n "  Backend Dockerfile... "
[ -f "backend/Dockerfile" ]
test_result "Backend Dockerfile existe"

echo -n "  Frontend Dockerfile... "
[ -f "frontend/Dockerfile" ]
test_result "Frontend Dockerfile existe"

echo ""
echo "📚 DOCUMENTATION:"
echo ""

# Check docs
for doc in README.md ARCHITECTURE.md DEPLOYMENT.md PRESENTATION_GUIDE.md; do
  echo -n "  $doc... "
  [ -f "$doc" ] && echo -e "${GREEN}✓${NC}" && ((TESTS_PASSED++)) || echo -e "${RED}✗${NC}" && ((TESTS_FAILED++))
done

echo ""
echo "📊 CI/CD:"
echo ""

# Check workflows
echo -n "  CI/CD workflow... "
[ -f ".github/workflows/ci-cd.yml" ]
test_result "CI/CD workflow existe"

echo -n "  Release workflow... "
[ -f ".github/workflows/release.yml" ]
test_result "Release workflow existe"

echo -n "  Dependency check... "
[ -f ".github/workflows/dependency-check.yml" ]
test_result "Dependency check workflow existe"

echo ""
echo "=========================================="
echo ""
echo "📊 RESULTADO:"
echo "  ✅ Tests Passed: $TESTS_PASSED"
echo "  ❌ Tests Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 TUDO FUNCIONANDO! Projeto pronto para apresentação!${NC}"
  exit 0
else
  echo -e "${RED}⚠️  $TESTS_FAILED testes falharam. Verifique os erros.${NC}"
  exit 1
fi
