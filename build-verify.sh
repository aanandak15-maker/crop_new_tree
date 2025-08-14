#!/bin/bash

echo "=== Build Verification Script ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "=== Installing dependencies ==="
npm ci --legacy-peer-deps --prefer-offline

echo "=== Building project ==="
npm run build:netlify

echo "=== Verifying build output ==="
if [ -d "dist" ]; then
    echo "✅ dist directory created successfully"
    echo "dist contents:"
    ls -la dist/
    
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html exists"
    else
        echo "❌ index.html missing"
        exit 1
    fi
else
    echo "❌ dist directory not created"
    exit 1
fi

echo "=== Build verification complete ==="
