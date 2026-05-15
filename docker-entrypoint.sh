#!/bin/sh
set -e

if [ "${SKIP_PRISMA_PUSH:-false}" = "true" ]; then
  echo "Skipping Prisma db push (SKIP_PRISMA_PUSH=true)."
else
  if [ -n "${DATABASE_URL}" ]; then
    echo "Applying Prisma schema (db push)..."
    prisma db push --skip-generate
  else
    echo "DATABASE_URL unset; skipping Prisma db push."
  fi
fi

exec node server.js
