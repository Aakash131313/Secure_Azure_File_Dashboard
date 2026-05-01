import type { StoredFile } from "@/types";

export type DashboardFile = {
  name: string;
  size: string;
  classification: string;
  uploadedAt: string;
};

type FileListProps = {
  files: StoredFile[];
  selectedFile?: string;
  isLoading: boolean;
  onRefresh: () => void;
  onSelectFile: (filename: string) => void;
};

export function FileList({ files, selectedFile, isLoading, onRefresh, onSelectFile }: FileListProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-dashboard">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Uploaded Files</h2>
          <p className="mt-1 text-sm text-slate-600">Files returned by the backend API.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {files.length} files
          </span>
          <button
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={onRefresh}
            type="button"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
        {isLoading && files.length === 0 ? (
          <div className="bg-white px-4 py-6 text-sm text-slate-500">Loading files...</div>
        ) : null}

        {!isLoading && files.length === 0 ? (
          <div className="bg-white px-4 py-6 text-sm text-slate-500">No files uploaded yet.</div>
        ) : null}

        {files.map((file) => {
          const isSelected = file.name === selectedFile;

          return (
            <button
              className={`grid w-full gap-2 px-4 py-3 text-left transition sm:grid-cols-[1fr_auto] ${
                isSelected ? "bg-azure-50" : "bg-white hover:bg-slate-50"
              }`}
              key={file.name}
              onClick={() => onSelectFile(file.name)}
              type="button"
            >
              <span>
                <span className="block text-sm font-semibold text-slate-950">{file.name}</span>
                <span className="mt-1 block text-xs text-slate-500">JSON file</span>
              </span>
              <span className="text-xs font-medium text-slate-500 sm:self-center">
                {isSelected ? "Selected" : "View"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
