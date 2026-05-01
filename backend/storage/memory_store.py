from __future__ import annotations

from typing import Any

from .store import DuplicateFileError, FileStore, StoredFileNotFoundError


class MemoryStore(FileStore):
    """Free-safe demo storage for Azure deployments.

    Data is held only in the current function worker process. It is useful for
    demos that avoid paid storage accounts, but it is not durable.
    """

    def __init__(self) -> None:
        self._files: dict[str, Any] = {}

    def upload(self, filename: str, content: Any) -> None:
        if filename in self._files:
            raise DuplicateFileError(filename)

        self._files[filename] = content

    def list_files(self) -> list[str]:
        return sorted(self._files.keys())

    def get_file(self, filename: str) -> Any:
        if filename not in self._files:
            raise StoredFileNotFoundError(filename)

        return self._files[filename]

    def delete_file(self, filename: str) -> None:
        if filename not in self._files:
            raise StoredFileNotFoundError(filename)

        del self._files[filename]
