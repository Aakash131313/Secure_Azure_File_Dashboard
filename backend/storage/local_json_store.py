from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .store import DuplicateFileError, FileStore, StoredFileNotFoundError


class LocalJsonStore(FileStore):
    """Development storage backed by one local JSON file.

    This is intentionally simple and free. In a production Azure version, this
    class is the place to swap in Blob Storage for content and Azure SQL or
    Cosmos DB for metadata.
    """

    def __init__(self, data_file_path: str) -> None:
        self.data_file_path = Path(data_file_path)

    def upload(self, filename: str, content: Any) -> None:
        data = self._read_data()
        if filename in data:
            raise DuplicateFileError(filename)

        data[filename] = content
        self._write_data(data)

    def list_files(self) -> list[str]:
        return sorted(self._read_data().keys())

    def get_file(self, filename: str) -> Any:
        data = self._read_data()
        if filename not in data:
            raise StoredFileNotFoundError(filename)

        return data[filename]

    def delete_file(self, filename: str) -> None:
        data = self._read_data()
        if filename not in data:
            raise StoredFileNotFoundError(filename)

        del data[filename]
        self._write_data(data)

    def _read_data(self) -> dict[str, Any]:
        if not self.data_file_path.exists():
            return {}

        with self.data_file_path.open("r", encoding="utf-8") as data_file:
            data = json.load(data_file)

        if not isinstance(data, dict):
            return {}

        return data

    def _write_data(self, data: dict[str, Any]) -> None:
        self.data_file_path.parent.mkdir(parents=True, exist_ok=True)
        with self.data_file_path.open("w", encoding="utf-8") as data_file:
            json.dump(data, data_file, indent=2, sort_keys=True)
