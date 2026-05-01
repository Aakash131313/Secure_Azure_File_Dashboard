export type ApiHealthStatus = "online" | "offline" | "checking";

export type StoredFile = {
  name: string;
};

export type FileContent = {
  filename: string;
  content: unknown;
};

export type StatusTone = "info" | "success" | "warning" | "error";
