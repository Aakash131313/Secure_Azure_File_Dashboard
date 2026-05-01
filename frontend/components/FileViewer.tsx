type FileViewerProps = {
  filename?: string;
  content?: unknown;
  isLoading: boolean;
  isDeleting: boolean;
  onDelete: () => void;
};

export function FileViewer({ filename, content, isLoading, isDeleting, onDelete }: FileViewerProps) {
  const hasFile = Boolean(filename);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-dashboard">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-slate-950">File Viewer</h2>
          <p className="text-sm text-slate-600">{filename ?? "Select a file to view its JSON content."}</p>
        </div>
        <button
          className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!hasFile || isDeleting}
          onClick={onDelete}
          type="button"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {isLoading ? (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Loading file content...
        </div>
      ) : hasFile && content !== undefined ? (
        <pre className="mt-5 max-h-[28rem] overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-50">
          <code>{JSON.stringify(content, null, 2)}</code>
        </pre>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          Uploaded JSON will appear here after you select a file.
        </div>
      )}
    </section>
  );
}
