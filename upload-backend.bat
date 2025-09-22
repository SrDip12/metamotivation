@echo off
echo Subiendo mot_back a Azure DevOps...

cd mot_back

REM Crear .gitignore si no existe
if not exist .gitignore (
    echo Creando .gitignore para Python...
    copy con .gitignore
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
dist/
*.egg-info/
.installed.cfg
*.egg

venv/
env/
ENV/

.env
.env.*

*.db
*.sqlite

.vscode/
.idea/

*.log

.coverage
.pytest_cache/
^Z
)

REM Crear README.md
echo Creando README.md...
echo # MetaMotivation Backend > README.md
echo. >> README.md
echo Backend API para la aplicacion MetaMotivation >> README.md
echo. >> README.md
echo ## Instalacion >> README.md
echo ```
echo pip install -r requirements.txt >> README.md
echo uvicorn app.main:app --reload >> README.md
echo ``` >> README.md

git init
git add .
git commit -m "Initial FastAPI backend setup"
git remote add origin https://biturrao@dev.azure.com/biturrao/Meta/_git/mot_back
git branch -M main
git push -u origin main

echo ✅ mot_back subido correctamente!
cd ..
