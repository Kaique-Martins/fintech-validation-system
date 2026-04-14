#!/bin/bash

# Backup files for presentation
# Cria um arquivo ZIP com tudo que você precisa

echo "📦 Criando backup para apresentação..."

BACKUP_DIR="fintech-presentation-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}_${TIMESTAMP}.zip"

# Create list of important files
FILES_TO_BACKUP=(
  "README.md"
  "ARCHITECTURE.md"
  "DEPLOYMENT.md"
  "PRESENTATION_GUIDE.md"
  "docker-compose.yml"
  "backend/src"
  "backend/dist"
  "frontend/src"
  "frontend/dist"
  ".github"
  "backend/package.json"
  "frontend/package.json"
)

# Criar zip
zip -r "$BACKUP_FILE" "${FILES_TO_BACKUP[@]}" \
  -x "*/node_modules/*" "*/dist/*" "*/.next/*" "*.log"

echo "✅ Backup criado: $BACKUP_FILE"
echo ""
echo "📌 Próximos passos:"
echo "1. Copia este arquivo para USB"
echo "2. Se internet cair na faculdade, você tem tudo offline"
echo "3. Descompacta e roda: docker-compose up --build"
echo ""
