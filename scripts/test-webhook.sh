#!/bin/sh
# Simule un push GitHub sur le webhook local
# Usage: sh scripts/test-webhook.sh

SECRET="${WEBHOOK_SECRET:-changeme}"
PAYLOAD='{"ref":"refs/heads/master","repository":{"name":"TP_TERRAFORM"}}'

SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

curl -s -X POST https://nextjs.local:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d "$PAYLOAD" \
  -k

echo ""
