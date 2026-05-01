# Free-Tier Notes

This project is designed to run locally or as a free-tier cloud demo.

## What Is Free

- Local backend with Azure Functions Core Tools
- Local frontend with Next.js
- Azure Functions Consumption plan for the backend
- Vercel free tier for the frontend
- Local JSON storage for development
- In-memory storage for Azure demo mode

## What Is Intentionally Avoided

The current project does not require:

- Azure SQL
- Cosmos DB
- Application Blob Storage
- Key Vault
- Paid App Service plans
- Paid databases
- Paid monitoring services
- Authentication services

These services should only be added later as optional production upgrades.

## Azure Functions Platform Storage

Azure Functions requires a default Azure Storage account for runtime operation. That storage account is part of the Functions platform setup.

This project does not use that account as application storage for uploaded JSON files.

For Azure deployment, configure:

```text
STORAGE_MODE=memory
```

That keeps uploaded JSON in memory and avoids adding a separate application storage service.

## Memory Mode Limitations

`STORAGE_MODE=memory` is free-tier friendly but not durable.

Uploaded files can disappear when:

- The Function App restarts
- Azure scales the Function App
- The app is redeployed
- The worker process is recycled

Use it for demos, not production data.

## Local JSON Limitations

`STORAGE_MODE=local` writes to:

```text
DATA_FILE_PATH=./data/files.json
```

This is helpful for local development, but it is not a production database or cloud storage layer.

## Avoiding Accidental Charges

- Use Azure Functions Consumption plan only.
- Use Vercel free tier only.
- Keep `STORAGE_MODE=memory` in Azure.
- Do not create Azure SQL.
- Do not create Cosmos DB.
- Do not add application Blob Storage.
- Do not add Key Vault.
- Do not create Premium, Dedicated, or paid App Service plans.
- Do not enable paid monitoring features.
- Delete the Azure resource group after demos if you no longer need it.

## Optional Future Paid Upgrades

These are not part of the current free project:

- Azure Blob Storage for durable uploaded JSON content
- Azure SQL or Cosmos DB for searchable metadata
- Azure Key Vault for managed app configuration
- Microsoft Entra ID for authentication
- Application Insights for production monitoring
