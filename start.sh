#!/bin/bash
echo "Starting BarberMatch Backend..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Environment: $NODE_ENV"
echo "Starting application..."
node dist/main.js