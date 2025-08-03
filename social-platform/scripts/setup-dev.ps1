# Development Setup Script
# This script helps set up the development environment

Write-Host "Setting up development environment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
}
catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Copy environment file if it doesn't exist
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
}
else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Start services
Write-Host "Starting services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be ready
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep 10

# Check if services are running
$postgres = docker-compose ps -q postgres
$typesense = docker-compose ps -q typesense

if ($postgres -and $typesense) {
    Write-Host "✓ All services are running!" -ForegroundColor Green
    Write-Host "PostgreSQL: http://localhost:5432" -ForegroundColor Cyan
    Write-Host "Typesense: http://localhost:8108" -ForegroundColor Cyan
}
else {
    Write-Host "✗ Some services failed to start. Check docker-compose logs." -ForegroundColor Red
}

Write-Host "Setup complete! You can now run 'npm run start:dev' to start the application." -ForegroundColor Green
