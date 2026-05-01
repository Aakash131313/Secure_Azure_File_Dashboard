"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiHealthBadge } from "@/components/ApiHealthBadge";
import { FileList } from "@/components/FileList";
import { FileViewer } from "@/components/FileViewer";
import { StatusCard } from "@/components/StatusCard";
import { UploadPanel } from "@/components/UploadPanel";
import {
  ApiError,
  deleteFile,
  getApiBaseUrl,
  getFile,
  getHealth,
  listFiles,
  uploadJsonFile,
} from "@/lib/api";
import type { ApiHealthStatus, FileContent, StatusTone, StoredFile } from "@/types";

const starterJson = {
  id: "audit-1042",
  owner: "demo-team",
  classification: "sample",
  controls: ["json-validation", "health-check", "stateless-api"],
  storageMode: "local-json",
};

type StatusMessage = {
  title: string;
  message: string;
  tone: StatusTone;
};

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return `${error.message} (${error.status})`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export default function Page() {
  const [healthStatus, setHealthStatus] = useState<ApiHealthStatus>("checking");
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [selectedFilename, setSelectedFilename] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<FileContent>();
  const [filename, setFilename] = useState("example.json");
  const [jsonText, setJsonText] = useState(JSON.stringify(starterJson, null, 2));
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({
    title: "Ready",
    message: "Start the Azure Functions backend, then upload valid JSON or refresh the file list.",
    tone: "info",
  });
  const [isHealthLoading, setIsHealthLoading] = useState(true);
  const [isFilesLoading, setIsFilesLoading] = useState(true);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const refreshHealth = useCallback(async () => {
    setIsHealthLoading(true);
    setHealthStatus("checking");

    try {
      const health = await getHealth();
      setHealthStatus(health.status === "ok" ? "online" : "offline");
    } catch {
      setHealthStatus("offline");
    } finally {
      setIsHealthLoading(false);
    }
  }, []);

  const refreshFiles = useCallback(async () => {
    setIsFilesLoading(true);

    try {
      const nextFiles = await listFiles();
      setFiles(nextFiles);
      setStatusMessage({
        title: "File list refreshed",
        message: `Loaded ${nextFiles.length} file${nextFiles.length === 1 ? "" : "s"} from the backend.`,
        tone: "success",
      });

    } catch (error) {
      setStatusMessage({
        title: "Could not load files",
        message: getErrorMessage(error),
        tone: "error",
      });
    } finally {
      setIsFilesLoading(false);
    }
  }, []);

  const selectFile = useCallback(async (nextFilename: string) => {
    setSelectedFilename(nextFilename);
    setSelectedFile(undefined);
    setIsFileLoading(true);

    try {
      const file = await getFile(nextFilename);
      setSelectedFile(file);
      setStatusMessage({
        title: "File loaded",
        message: `Loaded ${nextFilename}.`,
        tone: "success",
      });
    } catch (error) {
      setStatusMessage({
        title: "Could not load file",
        message: getErrorMessage(error),
        tone: "error",
      });
    } finally {
      setIsFileLoading(false);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    const cleanFilename = filename.trim();

    if (!cleanFilename) {
      setStatusMessage({
        title: "Filename required",
        message: "Enter a filename before uploading.",
        tone: "warning",
      });
      return;
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonText);
    } catch {
      setStatusMessage({
        title: "Invalid JSON",
        message: "Fix the JSON content before uploading. The backend accepts valid JSON only.",
        tone: "error",
      });
      return;
    }

    setIsUploading(true);

    try {
      await uploadJsonFile(cleanFilename, parsedJson);
      setStatusMessage({
        title: "Upload complete",
        message: `${cleanFilename} was uploaded successfully.`,
        tone: "success",
      });
      const nextFiles = await listFiles();
      setFiles(nextFiles);
      await selectFile(cleanFilename);
    } catch (error) {
      setStatusMessage({
        title: "Upload failed",
        message: getErrorMessage(error),
        tone: "error",
      });
    } finally {
      setIsUploading(false);
    }
  }, [filename, jsonText, selectFile]);

  const handleDelete = useCallback(async () => {
    if (!selectedFilename) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteFile(selectedFilename);
      setStatusMessage({
        title: "File deleted",
        message: `${selectedFilename} was removed from the backend store.`,
        tone: "success",
      });
      setSelectedFilename(undefined);
      setSelectedFile(undefined);
      const nextFiles = await listFiles();
      setFiles(nextFiles);
    } catch (error) {
      setStatusMessage({
        title: "Delete failed",
        message: getErrorMessage(error),
        tone: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [selectedFilename]);

  useEffect(() => {
    refreshHealth();
    refreshFiles();
  }, [refreshFiles, refreshHealth]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-azure-700">Azure-style portfolio project</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Secure Azure File Dashboard</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              A focused dashboard for uploading, listing, and inspecting structured JSON files through a free-tier
              Azure Functions backend.
            </p>
            <p className="mt-2 text-sm text-slate-500">API base URL: {apiBaseUrl}</p>
          </div>
          <ApiHealthBadge status={isHealthLoading ? "checking" : healthStatus} label="API health" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(20rem,25rem)_1fr]">
        <div className="space-y-6">
          <StatusCard title={statusMessage.title} message={statusMessage.message} tone={statusMessage.tone} />
          <UploadPanel
            filename={filename}
            isUploading={isUploading}
            jsonText={jsonText}
            onFilenameChange={setFilename}
            onJsonTextChange={setJsonText}
            onUpload={handleUpload}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(18rem,24rem)_1fr]">
          <FileList
            files={files}
            isLoading={isFilesLoading}
            onRefresh={refreshFiles}
            onSelectFile={selectFile}
            selectedFile={selectedFilename}
          />
          <FileViewer
            content={selectedFile?.content}
            filename={selectedFile?.filename ?? selectedFilename}
            isDeleting={isDeleting}
            isLoading={isFileLoading}
            onDelete={handleDelete}
          />
        </div>
      </section>
    </main>
  );
}
