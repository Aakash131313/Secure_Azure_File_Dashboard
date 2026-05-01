import type { FileContent } from "@/types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7071/api").replace(/\/+$/, "");

type HealthResponse = {
  status: string;
  service: string;
};

type UploadResponse = {
  message: string;
  filename: string;
};

type FilesResponse = {
  files: string[];
};

type DeleteResponse = {
  message: string;
  filename: string;
};

type ApiErrorBody = {
  error?: string;
  message?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await response.json().catch(() => ({}))) as ApiErrorBody;

  if (!response.ok) {
    throw new ApiError(body.message ?? body.error ?? "The API request failed.", response.status);
  }

  return body as T;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getHealth() {
  return requestJson<HealthResponse>("/health");
}

export function uploadJsonFile(filename: string, content: unknown) {
  return requestJson<UploadResponse>("/upload", {
    method: "POST",
    body: JSON.stringify({ filename, content }),
  });
}

export async function listFiles() {
  const response = await requestJson<FilesResponse>("/files");
  return response.files.map((name) => ({ name }));
}

export function getFile(filename: string) {
  return requestJson<FileContent>(`/file/${encodeURIComponent(filename)}`);
}

export function deleteFile(filename: string) {
  return requestJson<DeleteResponse>(`/file/${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });
}
