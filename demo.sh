#!/bin/bash

# Demo Script - Run everything needed for presentation
# Este script faz o setup completo para demonstração na faculdade

echo "🎬 FinTech Validation System - Demo Setup"
echo "========================================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📋 Opções:"
echo "  1 - Start Backend (localhost:3001)"
echo "  2 - Start Frontend (localhost:3000)"
echo "  3 - Start Both (Docker Compose)"
echo "  4 - Run Tests"
echo "  5 - Clean & Rebuild"
echo ""
read -p "Escolha uma opção (1-5): " choice

case $choice in
  1)
    echo ""
    echo -e "${YELLOW}Starting Backend...${NC}"
    echo ""
    cd backend
    echo "📦 Installing dependencies..."
    npm install
    echo ""
    echo -e "${GREEN}🚀 Backend starting...${NC}"
    npm run start:dev
    ;;
  
  2)
    echo ""
    echo -e "${YELLOW}Starting Frontend...${NC}"
    echo ""
    cd frontend
    echo "📦 Installing dependencies..."
    npm install
    echo ""
    echo -e "${GREEN}🚀 Frontend starting...${NC}"
    npm run dev
    ;;
  
  3)
    echo ""
    echo -e "${YELLOW}Starting Both with Docker Compose...${NC}"
    echo ""
    docker-compose up --build
    ;;
  
  4)
    echo ""
    echo -e "${YELLOW}Running Tests...${NC}"
    echo ""
    bash test-system.sh
    ;;
  
  5)
    echo ""
    echo -e "${YELLOW}Clean & Rebuild...${NC}"
    echo ""
    
    echo "📦 Cleaning backend..."
    cd backend
    rm -rf node_modules dist
    npm install
    npm run build
    
    echo ""
    echo "📦 Cleaning frontend..."
    cd ../frontend
    rm -rf node_modules dist
    npm install
    npm run build
    
    echo ""
    echo -e "${GREEN}✅ Clean & Rebuild Complete!${NC}"
    ;;
  
  *)
    echo "❌ Invalid option"
    exit 1
    ;;
esac
