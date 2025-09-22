@echo off
echo Subiendo mot_front a Azure DevOps...

cd mot_front

REM Crear .gitignore si no existe
if not exist .gitignore (
    echo Creando .gitignore para React Native...
    copy con .gitignore
node_modules/
npm-debug.log*
yarn-error.log*

.expo/
.expo-shared/
dist/
web-build/

.env
.env.local
.env.development
.env.production

build/
*.tgz

.DS_Store
Thumbs.db

.vscode/
.idea/

*.log
^Z
)

REM Crear .env.example
echo Creando .env.example...
echo # API Configuration > .env.example
echo EXPO_PUBLIC_API_URL=https://metamotivacion-api.loca.lt >> .env.example
echo EXPO_PUBLIC_API_URL_PROD=https://metamotivation-api.eastus.azurecontainer.io >> .env.example
echo. >> .env.example
echo # Gemini AI >> .env.example
echo EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key_here >> .env.example

REM Crear README.md
echo Creando README.md...
echo # MetaMotivation Mobile App > README.md
echo. >> README.md
echo Aplicacion movil para MetaMotivation >> README.md
echo. >> README.md
echo ## Instalacion >> README.md
echo ```
echo npm install >> README.md
echo npx expo start >> README.md
echo ``` >> README.md

git init
git add .
git commit -m "Initial React Native app setup"
git remote add origin https://biturrao@dev.azure.com/biturrao/Meta/_git/mot_front
git branch -M main
git push -u origin main

echo ✅ mot_front subido correctamente!
cd ..
