#!/bin/bash
echo "=== CREPA Auto Pull ==="
echo "Checking for updates from GitHub..."

if [ -d ".git" ]; then
    echo "Git repo found, pulling latest changes..."
    git pull origin main --no-rebase || echo "Pull failed or no changes"
else
    echo "No git repo found (first deploy was via upload), skipping pull."
    echo "To enable auto-pull, ensure server was deployed from GitHub or run: git clone"
fi

echo "Installing dependencies if needed..."
npm install --production --silent 2>&1 | tail -5

echo "Starting CREPA Ticket Bot..."
node index.js
