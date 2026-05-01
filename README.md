# Secure Azure File Dashboard

Secure Azure File Dashboard is a free-tier full-stack portfolio project that pairs a Python Azure Functions API with a Next.js, TypeScript, and Tailwind CSS dashboard for uploading, listing, viewing, and deleting JSON files.

It is built to look relevant for an Azure cloud application software engineering role while intentionally avoiding paid application services.

## Why This Project Exists

This project demonstrates practical cloud application fundamentals without requiring a paid Azure architecture:

- Stateless REST API design
- Frontend-to-backend integration
- JSON validation and error handling
- Swappable storage abstraction
- Lightweight backend tests
- Clear free-tier deployment path

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Python, Azure Functions |
| API style | Stateless REST endpoints |
| Local storage | JSON metadata/content file |
| Azure demo storage | In-memory storage |
| Testing | Pytest |
| Free deployment | Azure Functions Consumption plan, Vercel free tier |

## Features

- API health status badge
- JSON upload form with client-side validation
- Uploaded file list with refresh action
- Selected file viewer
- Delete selected file workflow
- Backend validation for invalid JSON, missing fields, duplicate names, and missing files
- Lightweight pytest coverage for the backend API behavior

## Architecture

```text
Frontend (Next.js)
  -> Azure Functions API
    -> Storage abstraction
      -> Local JSON file storage
      -> In-memory Azure demo storage
```

The API handlers stay stateless. Storage behavior is isolated behind a small interface so a future production version can replace local/demo storage without changing the frontend contract.

See [docs/architecture.md](docs/architecture.md) for more detail.

## Project Structure

```text
backend/
  function_app.py
  requirements.txt
  host.json
  local.settings.example.json
  storage/
  tests/

frontend/
  app/
  components/
  lib/
  package.json
  .env.local.example

docs/
  architecture.md
  free-tier-notes.md
  screenshots.md
```

## Local Setup

Prerequisites:

- Python 3.12+
- Node.js 20+
- Azure Functions Core Tools v4

Start the backend:

```powershell
cd backend
python -m pip install -r requirements.txt
copy local.settings.example.json local.settings.json
func start
```

Start the frontend in another terminal:

```powershell
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Use this frontend environment value:

```text
NEXT_PUBLIC_API_URL=http://localhost:7071/api
```

Open:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check API health |
| POST | `/api/upload` | Upload JSON content |
| GET | `/api/files` | List uploaded file names |
| GET | `/api/file/{name}` | View selected JSON content |
| DELETE | `/api/file/{name}` | Delete selected file |

## Curl Validation

Run these while the backend is running locally:

```powershell
curl.exe -i http://localhost:7071/api/health

curl.exe -i -X POST http://localhost:7071/api/upload `
  -H "Content-Type: application/json" `
  -d '{ "filename": "example.json", "content": { "owner": "demo-team", "classification": "sample" } }'

curl.exe -i http://localhost:7071/api/files

curl.exe -i http://localhost:7071/api/file/example.json

curl.exe -i -X DELETE http://localhost:7071/api/file/example.json
```

Invalid JSON check:

```powershell
curl.exe -i -X POST http://localhost:7071/api/upload `
  -H "Content-Type: application/json" `
  -d '{ invalid json }'
```

## Testing

Backend tests:

```powershell
cd backend
python -m pytest
```

Frontend build check:

```powershell
cd frontend
npm run build
```

## Free-Tier Deployment Summary

Backend:

- Deploy to Azure Functions Consumption plan only.
- Set `STORAGE_MODE=memory` for Azure demo mode.
- Do not add Azure SQL, Cosmos DB, application Blob Storage, Key Vault, paid App Service plans, paid databases, or paid monitoring.
- Azure Functions requires a platform storage account for runtime operation; this app does not use it for uploaded JSON content.

Frontend:

- Deploy to Vercel free tier.
- Set `NEXT_PUBLIC_API_URL=https://YOUR_FUNCTION_APP_NAME.azurewebsites.net/api`.
- Add the Vercel URL to Azure Functions CORS.

Useful commands:

```powershell
az functionapp config appsettings set `
  --name YOUR_FUNCTION_APP_NAME `
  --resource-group YOUR_RESOURCE_GROUP `
  --settings STORAGE_MODE=memory

az functionapp cors add `
  --name YOUR_FUNCTION_APP_NAME `
  --resource-group YOUR_RESOURCE_GROUP `
  --allowed-origins https://YOUR_VERCEL_URL

cd backend
func azure functionapp publish YOUR_FUNCTION_APP_NAME

cd frontend
vercel --prod
```

Full free-tier deployment details are in [docs/free-tier-notes.md](docs/free-tier-notes.md).

## Screenshots

Screenshot placeholders are tracked in [docs/screenshots.md](docs/screenshots.md):

- Dashboard home
- Upload success
- File viewer
- API health badge
- Backend tests passing
- Frontend build passing

## Future Upgrade Path

These are optional future paid upgrades, not part of the current free-tier project:

- Azure Blob Storage for durable uploaded JSON content
- Azure SQL or Cosmos DB for metadata
- Azure Key Vault for managed app configuration
- Microsoft Entra ID for authentication
- Application Insights for production monitoring

## Resume Bullets

- Built full-stack Azure-style file dashboard using Azure Functions, Next.js, TypeScript, and Tailwind CSS for structured JSON upload and retrieval workflows.
- Developed stateless REST API with modular storage abstraction, enabling future migration to Blob Storage, Azure SQL, and Key Vault.
- Added API health checks, validation handling, and lightweight tests to improve reliability across local and cloud deployment paths.
