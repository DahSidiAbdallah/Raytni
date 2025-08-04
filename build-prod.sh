#!/bin/bash

# Production Build Script for Raytni

set -e

echo "🚀 Starting production build for Raytni..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build for production
echo "🏗️  Building for production..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Production build completed successfully!"
    echo "📁 Build files are located in the 'dist' directory"
    echo "🌐 You can preview the build by running: npm run preview"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Raytni is ready for production deployment!"
