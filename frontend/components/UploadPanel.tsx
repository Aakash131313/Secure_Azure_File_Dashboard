type UploadPanelProps = {
  filename: string;
  jsonText: string;
  isUploading: boolean;
  onFilenameChange: (value: string) => void;
  onJsonTextChange: (value: string) => void;
  onUpload: () => void;
};

export function UploadPanel({
  filename,
  jsonText,
  isUploading,
  onFilenameChange,
  onJsonTextChange,
  onUpload,
}: UploadPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-dashboard">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-slate-950">Upload JSON</h2>
        <p className="text-sm leading-6 text-slate-600">Upload a JSON object to the Azure Functions API.</p>
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onUpload();
        }}
      >
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Filename</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-azure-600 focus:ring-4 focus:ring-azure-100"
            onChange={(event) => onFilenameChange(event.target.value)}
            placeholder="demo.json"
            value={filename}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">JSON content</span>
          <textarea
            className="mt-2 min-h-40 w-full resize-none rounded-lg border border-slate-300 bg-slate-950 px-3 py-3 font-mono text-sm leading-6 text-slate-50 outline-none transition focus:border-azure-600 focus:ring-4 focus:ring-azure-100"
            onChange={(event) => onJsonTextChange(event.target.value)}
            value={jsonText}
          />
        </label>

        <button
          className="w-full rounded-lg bg-azure-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-azure-700 focus:outline-none focus:ring-4 focus:ring-azure-100 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isUploading}
          type="submit"
        >
          {isUploading ? "Uploading..." : "Upload JSON"}
        </button>
      </form>
    </section>
  );
}
