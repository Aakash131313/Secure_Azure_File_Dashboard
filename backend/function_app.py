from __future__ import annotations

import json
import os
from typing import Any

import azure.functions as func

from storage.local_json_store import LocalJsonStore
from storage.memory_store import MemoryStore
from storage.store import DuplicateFileError, FileStore, StoredFileNotFoundError


SERVICE_NAME = "secure-azure-file-dashboard-api"
DEFAULT_DATA_FILE_PATH = "./data/files.json"

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
_memory_store = MemoryStore()


def get_store() -> FileStore:
    """Choose storage from environment variables.

    STORAGE_MODE=local uses a JSON file for local development.
    STORAGE_MODE=memory uses process memory for free-safe Azure demo mode.

    Optional future paid Azure upgrades can replace this factory with Blob
    Storage, Azure SQL, and Key Vault-backed configuration without changing the
    route handlers. Those services are not part of the current free project.
    """

    storage_mode = os.getenv("STORAGE_MODE", "local").strip().lower()
    if storage_mode == "memory":
        return _memory_store

    data_file_path = os.getenv("DATA_FILE_PATH", DEFAULT_DATA_FILE_PATH)
    return LocalJsonStore(data_file_path)


def json_response(body: dict[str, Any], status_code: int = 200) -> func.HttpResponse:
    return func.HttpResponse(
        json.dumps(body),
        status_code=status_code,
        mimetype="application/json",
    )


def parse_json_body(req: func.HttpRequest) -> tuple[dict[str, Any] | None, func.HttpResponse | None]:
    try:
        body = req.get_json()
    except ValueError:
        return None, json_response({"error": "invalid_json", "message": "Request body must be valid JSON."}, 400)

    if not isinstance(body, dict):
        return None, json_response({"error": "invalid_body", "message": "Request body must be a JSON object."}, 400)

    return body, None


def validate_filename(filename: Any) -> str | None:
    if not isinstance(filename, str) or not filename.strip():
        return None

    clean_filename = filename.strip()
    if "/" in clean_filename or "\\" in clean_filename:
        return None

    return clean_filename


@app.route(route="health", methods=["GET"])
def health(req: func.HttpRequest) -> func.HttpResponse:
    return json_response({"status": "ok", "service": SERVICE_NAME})


@app.route(route="upload", methods=["POST"])
def upload(req: func.HttpRequest) -> func.HttpResponse:
    body, error = parse_json_body(req)
    if error:
        return error

    filename = validate_filename(body.get("filename"))
    if filename is None:
        return json_response(
            {
                "error": "missing_filename",
                "message": "Provide a non-empty filename without path separators.",
            },
            400,
        )

    if "content" not in body:
        return json_response(
            {"error": "missing_content", "message": "Provide JSON content to upload."},
            400,
        )

    try:
        get_store().upload(filename, body["content"])
    except DuplicateFileError:
        return json_response(
            {"error": "duplicate_filename", "message": f"File '{filename}' already exists."},
            409,
        )

    return json_response({"message": "uploaded", "filename": filename}, 201)


@app.route(route="files", methods=["GET"])
def list_files(req: func.HttpRequest) -> func.HttpResponse:
    return json_response({"files": get_store().list_files()})


@app.route(route="file/{name}", methods=["GET"])
def get_file(req: func.HttpRequest) -> func.HttpResponse:
    filename = validate_filename(req.route_params.get("name"))
    if filename is None:
        return json_response(
            {
                "error": "missing_filename",
                "message": "Provide a valid filename in the route.",
            },
            400,
        )

    try:
        content = get_store().get_file(filename)
    except StoredFileNotFoundError:
        return json_response(
            {"error": "file_not_found", "message": f"File '{filename}' was not found."},
            404,
        )

    return json_response({"filename": filename, "content": content})


@app.route(route="file/{name}", methods=["DELETE"])
def delete_file(req: func.HttpRequest) -> func.HttpResponse:
    filename = validate_filename(req.route_params.get("name"))
    if filename is None:
        return json_response(
            {
                "error": "missing_filename",
                "message": "Provide a valid filename in the route.",
            },
            400,
        )

    try:
        get_store().delete_file(filename)
    except StoredFileNotFoundError:
        return json_response(
            {"error": "file_not_found", "message": f"File '{filename}' was not found."},
            404,
        )

    return json_response({"message": "deleted", "filename": filename})
