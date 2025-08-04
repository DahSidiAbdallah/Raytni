@echo off

REM Production Build Script for Raytni (Windows)

echo 🚀 Starting production build for Raytni...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm ci
if errorlevel 1 (
    echo ❌ Failed to install dependencies!
    exit /b 1
)

REM Run linting
echo 🔍 Running linter...
npm run lint
if errorlevel 1 (
    echo ⚠️  Linting issues found, but continuing with build...
)

REM Build for production
echo 🏗️  Building for production...
npm run build
if errorlevel 1 (
    echo ❌ Build failed!
    exit /b 1
)

REM Check if build was successful
if exist "dist" (
    echo ✅ Production build completed successfully!
    echo 📁 Build files are located in the 'dist' directory
    echo 🌐 You can preview the build by running: npm run preview
) else (
    echo ❌ Build failed!
    exit /b 1
)

echo 🎉 Raytni is ready for production deployment!
