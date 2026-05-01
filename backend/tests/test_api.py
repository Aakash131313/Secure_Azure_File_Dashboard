from __future__ import annotations

import importlib
import json
import sys
import types

import pytest


class FakeHttpResponse:
    def __init__(self, body: str, status_code: int = 200, mimetype: str = "text/plain") -> None:
        self.status_code = status_code
        self.mimetype = mimetype
        self._body = body.encode("utf-8")

    def get_body(self) -> bytes:
        return self._body


class FakeFunctionApp:
    def __init__(self, http_auth_level: str | None = None) -> None:
        self.http_auth_level = http_auth_level

    def route(self, route: str, methods: list[str]):
        def decorator(handler):
            return handler

        return decorator


class FakeRequest:
    def __init__(self, body=None, route_params: dict[str, str] | None = None, invalid_json: bool = False) -> None:
        self.body = body
        self.route_params = route_params or {}
        self.invalid_json = invalid_json

    def get_json(self):
        if self.invalid_json:
            raise ValueError("invalid JSON")

        return self.body


@pytest.fixture()
def api_module(monkeypatch, tmp_path):
    """Import function_app with a tiny fake azure.functions module.

    These tests validate our code without requiring Azure Functions Core Tools,
    the Azure Functions host, network calls, or deployed Azure resources.
    """

    azure_module = types.ModuleType("azure")
    functions_module = types.ModuleType("azure.functions")
    functions_module.HttpResponse = FakeHttpResponse
    functions_module.HttpRequest = FakeRequest
    functions_module.FunctionApp = FakeFunctionApp
    functions_module.AuthLevel = types.SimpleNamespace(ANONYMOUS="anonymous")
    azure_module.functions = functions_module

    monkeypatch.setitem(sys.modules, "azure", azure_module)
    monkeypatch.setitem(sys.modules, "azure.functions", functions_module)
    monkeypatch.setenv("STORAGE_MODE", "local")
    monkeypatch.setenv("DATA_FILE_PATH", str(tmp_path / "files.json"))

    sys.modules.pop("function_app", None)
    return importlib.import_module("function_app")


def response_json(response: FakeHttpResponse) -> dict:
    return json.loads(response.get_body().decode("utf-8"))


def test_health_response_logic(api_module):
    response = api_module.health(FakeRequest())

    assert response.status_code == 200
    assert response_json(response) == {
        "status": "ok",
        "service": "secure-azure-file-dashboard-api",
    }


def test_upload_valid_json(api_module):
    request = FakeRequest(
        {
            "filename": "demo.json",
            "content": {"owner": "azure", "classification": "confidential"},
        }
    )

    response = api_module.upload(request)

    assert response.status_code == 201
    assert response_json(response) == {"message": "uploaded", "filename": "demo.json"}


def test_reject_invalid_upload_json(api_module):
    response = api_module.upload(FakeRequest(invalid_json=True))

    assert response.status_code == 400
    assert response_json(response)["error"] == "invalid_json"


def test_reject_missing_filename(api_module):
    response = api_module.upload(FakeRequest({"content": {"ok": True}}))

    assert response.status_code == 400
    assert response_json(response)["error"] == "missing_filename"


def test_reject_missing_content(api_module):
    response = api_module.upload(FakeRequest({"filename": "demo.json"}))

    assert response.status_code == 400
    assert response_json(response)["error"] == "missing_content"


def test_reject_duplicate_filename(api_module):
    request = FakeRequest({"filename": "demo.json", "content": {"version": 1}})
    duplicate_request = FakeRequest({"filename": "demo.json", "content": {"version": 2}})

    api_module.upload(request)
    response = api_module.upload(duplicate_request)

    assert response.status_code == 409
    assert response_json(response)["error"] == "duplicate_filename"


def test_list_files(api_module):
    api_module.upload(FakeRequest({"filename": "beta.json", "content": {"order": 2}}))
    api_module.upload(FakeRequest({"filename": "alpha.json", "content": {"order": 1}}))

    response = api_module.list_files(FakeRequest())

    assert response.status_code == 200
    assert response_json(response) == {"files": ["alpha.json", "beta.json"]}


def test_get_file(api_module):
    api_module.upload(FakeRequest({"filename": "demo.json", "content": {"hello": "azure"}}))

    response = api_module.get_file(FakeRequest(route_params={"name": "demo.json"}))

    assert response.status_code == 200
    assert response_json(response) == {
        "filename": "demo.json",
        "content": {"hello": "azure"},
    }


def test_get_missing_file(api_module):
    response = api_module.get_file(FakeRequest(route_params={"name": "missing.json"}))

    assert response.status_code == 404
    assert response_json(response)["error"] == "file_not_found"


def test_delete_file(api_module):
    api_module.upload(FakeRequest({"filename": "demo.json", "content": {"hello": "azure"}}))

    response = api_module.delete_file(FakeRequest(route_params={"name": "demo.json"}))

    assert response.status_code == 200
    assert response_json(response) == {"message": "deleted", "filename": "demo.json"}
    assert response_json(api_module.list_files(FakeRequest())) == {"files": []}


def test_delete_missing_file(api_module):
    response = api_module.delete_file(FakeRequest(route_params={"name": "missing.json"}))

    assert response.status_code == 404
    assert response_json(response)["error"] == "file_not_found"
