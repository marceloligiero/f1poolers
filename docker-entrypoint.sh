#!/bin/sh

# Start API server in background
cd /app/server
npx tsx src/index.ts &

# Start frontend server
cd /app
serve -s dist -l 3000
