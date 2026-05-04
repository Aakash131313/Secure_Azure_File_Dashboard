# Secure Azure File Dashboard

Secure Azure File Dashboard is a free-tier full-stack project that demonstrates how a simple cloud application can be structured using an Azure-style backend and a modern frontend. It allows users to upload, view, list, and delete JSON files through a clean dashboard interface while keeping the architecture modular and easy to extend to real cloud services.

---

## Why This Project Exists

This project is designed to show how real cloud applications are structured without relying on paid services. It focuses on practical backend and frontend patterns rather than just UI.

Key ideas demonstrated:
- Stateless REST API design  
- Frontend to backend communication  
- JSON validation and error handling  
- Swappable storage layer (local, memory, or cloud later)  
- Lightweight backend testing  
- Clean, free-tier friendly architecture  

---

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS  
- **Backend:** Python, Azure Functions  
- **API Style:** Stateless REST endpoints  
- **Storage (local):** JSON file  
- **Storage (Azure demo):** In-memory  
- **Testing:** Pytest  
- **Deployment (free):** Azure Functions Consumption, Vercel  

---

## Features

- API health status indicator  
- JSON upload with validation  
- File listing with refresh  
- JSON file viewer  
- Delete file functionality  
- Clear error handling and feedback messages  

---

## How It Works

The application is split into two main parts:

- **Frontend (Next.js)**  
  - Handles user interaction and UI  
  - Sends requests to the backend  

- **Backend (Azure Functions)**  
  - Processes requests  
  - Validates input  
  - Reads and writes data  

Flow:

Frontend → API → Storage Layer → Response  

The storage layer is abstracted so it can be swapped without changing the API:
- Local JSON file (development)
- In-memory storage (free Azure demo)
- Cloud storage (future upgrade)

---

## Running Locally

### Start backend

```bash
cd backend
copy local.settings.example.json local.settings.json
func.cmd start

### Start frontend
cd frontend
copy .env.local.example .env.local
npm.cmd install
npm.cmd run dev

#### Then open
http://localhost:3000


API Endpoints
GET /api/health
Check if the backend is running
POST /api/upload
Upload a JSON file
GET /api/files
List all stored files
GET /api/file/{name}
Retrieve a specific file
DELETE /api/file/{name}
Delete a file


Example JSON:

{
  "project": "Secure Azure File Dashboard",
  "status": "working"
}

Save as:
example.json


Then:

Upload it through the UI
View it in the file list
Click to inspect the contents
Delete it when finished


Free Tier Design

This project intentionally avoids paid services.

No Azure SQL
No Blob Storage as active dependency
No Key Vault
No paid compute plans

Notes:

Azure Functions still requires a platform storage account to run
Application data is stored locally or in memory to remain free
Future Improvements
Replace in-memory storage with Azure Blob Storage
Add database support for metadata
Add authentication
Add search and filtering
Deploy fully to Azure and Vercel
