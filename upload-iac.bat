@echo off
echo Subiendo mot_iac a Azure DevOps...

cd mot_iac

REM Crear .gitignore si no existe
if not exist .gitignore (
    echo Creando .gitignore...
    copy con .gitignore
# Environment files
.env
.env.local
.env.production
.env.development

# Docker volumes/data
postgres-data/
.docker/
docker-compose.override.yml

# Logs
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
^Z
)

REM Crear .env.example
echo Creando .env.example...
echo # Database Configuration > .env.example
echo POSTGRES_USER=postgres >> .env.example
echo POSTGRES_PASSWORD=your_password_here >> .env.example
echo POSTGRES_DB=metamotivation >> .env.example
echo. >> .env.example
echo # Backend Configuration >> .env.example
echo SECRET_KEY=your_secret_key_here >> .env.example
echo DATABASE_URL=postgresql://postgres:your_password_here@db:5432/metamotivation >> .env.example

git init
git add .
git commit -m "Initial Infrastructure as Code setup"
git remote add origin https://biturrao@dev.azure.com/biturrao/Meta/_git/mot_iac
git branch -M main
git push -u origin main

echo ✅ mot_iac subido correctamente!
cd ..
