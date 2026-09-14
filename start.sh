#!/bin/bash
echo "=== CREPA Auto Pull ==="
echo "Checking for updates from GitHub..."

if [ -d ".git" ]; then
    echo "Git repo found, pulling latest changes..."
    git fetch origin main 2>&1 | head -5
    git pull origin main --no-rebase || echo "Pull failed, continuing with local files"
else
    echo "No git repo found, initializing from GitHub (first time)..."
    git init -q
    git remote add origin https://github.com/bensaedis-commits/crepa-ticket.git 2>/dev/null || git remote set-url origin https://github.com/bensaedis-commits/crepa-ticket.git
    git fetch origin main --depth=1 2>&1 | head -5
    git reset --hard origin/main 2>&1 | head -5
    echo "Git repo initialized"
fi

echo "Installing dependencies if needed..."
npm install --production --silent 2>&1 | tail -5

echo "Starting CREPA Ticket Bot..."
node index.js
