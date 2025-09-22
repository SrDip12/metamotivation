# MetaMotivation - Backend API

Backend FastAPI para la aplicacion MetaMotivation desplegado en Railway.

## 🚀 En Vivo
- Backend API: Desplegado automaticamente en Railway
- Documentacion: /docs

## 📁 Estructura
```
/
├── app/                 # Codigo FastAPI
│   ├── main.py         # Aplicacion principal
│   ├── api/            # Endpoints API
│   ├── models/         # Modelos de base de datos
│   └── schemas/        # Esquemas Pydantic
├── requirements.txt    # Dependencias Python
├── Dockerfile         # Configuracion Docker
└── railway.toml       # Configuracion Railway
```

## 🔧 Endpoints Principales
- `GET /docs` - Documentacion interactiva
- `POST /api/v1/login/access-token` - Iniciar sesion
- `POST /api/v1/users/register` - Registrar usuario
- `POST /api/v1/check-in/` - Check-in diario de motivacion
- `GET /api/v1/dashboard/motivation-history` - Historial motivacion
- `GET /api/v1/questions/` - Cuestionario metamotivacion

## 📱 App Movil
El frontend React Native se conecta a esta API para funcionar.

## 🔄 Auto-Deploy
Cada push a main hace deploy automatico en Railway.
