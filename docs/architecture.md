# Architecture

Secure Azure File Dashboard uses a small, intentionally simple architecture that mirrors common cloud application patterns without requiring paid application services.

## Text Diagram

```text
Frontend (Next.js + TypeScript + Tailwind)
  -> HTTP requests through NEXT_PUBLIC_API_URL
    -> Backend API (Python Azure Functions)
      -> Storage abstraction
        -> Local JSON mode for development
        -> In-memory mode for Azure free-tier demo
```

## Frontend Layer

The frontend is a Next.js dashboard located in `frontend/`.

Responsibilities:

- Render the dashboard shell and status messages
- Check API health
- Upload JSON content
- Refresh and display the file list
- Request selected file content
- Delete selected files

API calls are isolated in `frontend/lib/api.ts`. The UI reads `NEXT_PUBLIC_API_URL`, which allows the same frontend to target either a local backend or a deployed Azure Functions backend.

## Backend API Layer

The backend is a Python Azure Functions app located in `backend/function_app.py`.

Endpoints:

- `GET /api/health`
- `POST /api/upload`
- `GET /api/files`
- `GET /api/file/{name}`
- `DELETE /api/file/{name}`

The API handlers are stateless. Each request validates inputs, calls the storage abstraction, and returns a clear JSON response.

## Storage Abstraction

The storage contract lives in `backend/storage/store.py`.

Implementations:

- `backend/storage/local_json_store.py`
- `backend/storage/memory_store.py`

This keeps storage decisions separate from API routing. The current app can run with local JSON storage during development and in-memory storage for a free Azure demo.

## Local JSON Mode

Local JSON mode is selected with:

```text
STORAGE_MODE=local
DATA_FILE_PATH=./data/files.json
```

It is useful for local development because uploaded JSON survives local server restarts. It is not intended as production storage.

## In-Memory Azure Demo Mode

In-memory mode is selected with:

```text
STORAGE_MODE=memory
```

This mode stores uploaded JSON inside the current function worker process. It avoids adding an application database or durable storage service, which keeps the project free-tier focused.

Limitation: uploaded files are not persistent across restarts, redeployments, or scale events.

## Why Paid Services Are Excluded

The project is designed as a resume-ready free-tier demo. It intentionally avoids:

- Azure SQL
- Cosmos DB
- Application Blob Storage
- Key Vault
- Paid App Service plans
- Paid monitoring services
- Authentication services

Azure Functions still requires a platform storage account for runtime operation. That platform storage is not used by this application to store uploaded JSON content.

## Optional Future Production Upgrades

These are not part of the current free project:

- Azure Blob Storage for durable uploaded JSON content
- Azure SQL or Cosmos DB for metadata
- Azure Key Vault for managed app configuration
- Microsoft Entra ID for authentication
- Application Insights for production monitoring

The storage abstraction is the main extension point for those upgrades.
