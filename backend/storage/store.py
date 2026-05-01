from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class StoreError(Exception):
    """Base class for expected storage errors."""


class DuplicateFileError(StoreError):
    """Raised when a file already exists."""


class StoredFileNotFoundError(StoreError):
    """Raised when a file does not exist."""


class FileStore(ABC):
    """Small storage contract used by the HTTP API.

    This boundary keeps the Azure Functions endpoints stateless and makes it
    straightforward to replace local/mock storage with Azure Blob Storage for
    content, Azure SQL for metadata, or Key Vault-backed credentials in an
    optional future paid version. Those services are not used here.
    """

    @abstractmethod
    def upload(self, filename: str, content: Any) -> None:
        """Store JSON content under a filename."""

    @abstractmethod
    def list_files(self) -> list[str]:
        """Return stored filenames."""

    @abstractmethod
    def get_file(self, filename: str) -> Any:
        """Return JSON content for a filename."""

    @abstractmethod
    def delete_file(self, filename: str) -> None:
        """Delete a stored file."""
