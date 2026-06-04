#!/bin/sh
set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NEXTJS_DIR="$REPO_DIR/nextjs"

echo "Déploiement en cours..."

cd "$REPO_DIR"
git pull origin master

cd "$NEXTJS_DIR"
npm ci
npm run build

echo "Déploiement terminé."
