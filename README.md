Phase 0: Plan

Project goal: build Secure Azure File Dashboard, a resume-ready full-stack cloud-style app that demonstrates Azure Functions, REST API design, TypeScript frontend work, validation, testing, and deployment awareness while staying completely free to run.

The app will let a user upload JSON, list uploaded JSON files, view a selected file, delete a file, and see backend health status. It will look and feel like an Azure cloud application project without requiring paid Azure resources.

Free-Resource Architecture

Backend:

Python Azure Functions API
Consumption plan free grant for Azure deployment
Stateless REST endpoints
Local development storage via a JSON metadata/content file
Azure deployment mode can use temporary in-memory mock storage
No Azure SQL
No Blob Storage required
No Key Vault required
Environment variables / Azure App Settings for configuration
Frontend:

Next.js
TypeScript
Tailwind CSS
Can run locally for free
Can deploy to Vercel free tier
Uses NEXT_PUBLIC_API_URL to connect to the backend
Storage:

Local development: JSON file under backend-local runtime data
Azure/free-safe deployment: in-memory mock store, suitable for demo behavior but not persistence
Future upgrade path clearly documented for Blob Storage, Azure SQL, and Key Vault
Tradeoffs Compared With A Paid Azure Version

The free version is intentionally demo-oriented. It proves API design, frontend integration, validation, and cloud deployment shape without introducing paid dependencies.

Limitations:

In-memory Azure mode is not durable; uploaded files may disappear when the function app restarts.
Local JSON file storage is good for development but not production-grade.
No authentication or authorization yet.
No Blob Storage, Azure SQL, or Key Vault until explicitly added later.
File upload is JSON-only and intentionally scoped.
Optional future paid Azure upgrade path (not part of the current free project):

Replace local/mock storage with Azure Blob Storage.
Add Azure SQL or Cosmos DB for metadata.
Use Key Vault for managed app configuration.
Add Microsoft Entra ID authentication.
Add Application Insights and richer observability.
Implementation Phases

Phase 1: Backend API

Goal:
Create the Python Azure Functions backend with all required REST endpoints and a simple swappable storage abstraction.

Files to create or edit:

backend/function_app.py
backend/requirements.txt
backend/host.json
backend/local.settings.example.json
Possibly backend/storage/ if a small storage module makes the code cleaner
Exact implementation steps:

Create Azure Functions Python app structure under backend/.
Implement GET /api/health.
Implement POST /api/upload.
Implement GET /api/files.
Implement GET /api/file/{name}.
Implement DELETE /api/file/{name}.
Add local JSON file storage for local development.
Add mock/in-memory storage mode for free-safe Azure deployment.
Add validation for:
invalid JSON
missing filename
duplicate uploads
missing file
Add comments explaining future swap points for Blob Storage, Azure SQL, and Key Vault.
Validation steps:

Run the function app locally.
Validate every endpoint with curl:
health check
upload valid JSON
upload invalid JSON
list files
get file
delete file
get missing file
Done means:

All five endpoints exist.
Local JSON storage works.
Error responses are clear.
Curl validation examples are known and repeatable.
Phase 2: Backend Tests

Goal:
Add lightweight pytest coverage for core API behavior.

Files to create or edit:

backend/tests/test_api.py
Possibly small backend refactors if needed to make endpoint logic testable
Exact implementation steps:

Add pytest to backend requirements.
Structure endpoint logic so tests can call it without heavy Azure runtime setup where practical.
Add tests for:
health check
valid JSON upload
invalid upload rejection
list files
get file
delete file
Use temporary test storage so tests do not mutate normal local data.
Validation steps:

Run:
cd backend
python -m pytest
Done means:

Tests pass locally.
Tests are lightweight and do not require Azure, paid services, or network calls.
Phase 3: Frontend UI

Goal:
Create a polished Next.js TypeScript Tailwind dashboard UI.

Files to create or edit:

frontend/package.json
frontend/app/page.tsx
frontend/components/UploadPanel.tsx
frontend/components/FileList.tsx
frontend/components/FileViewer.tsx
frontend/components/StatusCard.tsx
frontend/components/ApiHealthBadge.tsx
frontend/.env.local.example
Tailwind and Next config files as needed
Exact implementation steps:

Create Next.js app structure under frontend/.
Configure TypeScript and Tailwind CSS.
Build dashboard layout with:
title/header
API health badge
upload panel
file list
file viewer
status/error messages
Keep styling clean, professional, responsive, and dashboard-oriented.
Avoid overbuilding features like authentication, search, role management, or databases.
Validation steps:

Run frontend locally.
Confirm layout renders cleanly on desktop and mobile sizes.
Confirm components show expected empty/loading/error states.
Done means:

UI is demo-ready.
Required components exist.
The page looks like a credible cloud software engineering portfolio project.
Phase 4: Frontend/API Integration

Goal:
Connect the frontend to the backend API with robust loading and error handling.

Files to create or edit:

frontend/app/page.tsx
frontend/components/UploadPanel.tsx
frontend/components/FileList.tsx
frontend/components/FileViewer.tsx
frontend/components/ApiHealthBadge.tsx
Possibly frontend/lib/api.ts
Exact implementation steps:

Add NEXT_PUBLIC_API_URL support.
Fetch health status from /api/health.
Upload JSON to /api/upload.
Refresh file list after upload/delete.
Fetch selected file content.
Delete files through the API.
Add visible loading, success, and error states.
Validation steps:

Run backend locally.
Run frontend locally.
Validate:
API health loads
upload works
file list refreshes
selected file displays
delete removes file from list
Done means:

Frontend and backend work together locally.
All required user workflows are functional.
Errors are visible and understandable.
Phase 5: Deployment Notes

Goal:
Document free deployment paths without requiring paid services.

Files to create or edit:

README.md
docs/free-tier-notes.md
Possibly docs/architecture.md
Exact implementation steps:

Explain Azure Functions Consumption deployment.
Explain Vercel free frontend deployment.
List required environment variables:
backend app settings
frontend NEXT_PUBLIC_API_URL
Explain CORS setup for Vercel frontend URL.
Make clear that Blob Storage, Azure SQL, and Key Vault are optional future upgrades, not current requirements.
Validation steps:

Review docs to ensure no paid resource is required.
Confirm instructions do not depend on Blob Storage, Azure SQL, Key Vault, or paid App Service plans.
Done means:

A reader can understand how to deploy the app for free.
Cost constraints are explicit.
Free-tier limitations are clearly explained.
Phase 6: Documentation And Resume Polish

Goal:
Make the project portfolio-ready.

Files to create or edit:

README.md
docs/architecture.md
docs/free-tier-notes.md
Exact implementation steps:

Add README with:
project overview
text architecture diagram
tech stack
local setup instructions
API endpoint docs
screenshots section placeholders
free-tier notes
future Azure upgrades
Add architecture documentation.
Add free-tier notes.
Add the required resume bullets:
Built full-stack Azure-style file dashboard using Azure Functions, Next.js, TypeScript, and Tailwind CSS for structured JSON upload and retrieval workflows
Developed stateless REST API with modular storage abstraction, enabling future migration to Blob Storage, Azure SQL, and Key Vault
Added API health checks, validation handling, and lightweight tests to improve reliability across local and cloud deployment paths
Validation steps:

Read docs end to end.
Confirm setup commands match the actual files.
Confirm resume bullets are present.
Confirm future paid upgrades are framed as optional.
Done means:

The repository is understandable to recruiters and engineers.
The project is simple, polished, and resume-ready.
The docs match the implementation.
Phase 0 Summary

What changed:

No files changed.
Created a clear implementation plan only.
How to validate it:

Confirm the phase breakdown matches your requested scope and cost constraints.
Confirm the architecture avoids paid services.
Limitations:

No code has been written yet.
Exact package versions and implementation details will be chosen in later phases based on the local repo state.
Next recommended phase:

Phase 1: build the Python Azure Functions backend API.
