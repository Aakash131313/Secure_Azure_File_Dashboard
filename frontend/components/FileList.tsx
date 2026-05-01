export type DashboardFile = {
  name: string;
  size: string;
  classification: string;
  uploadedAt: string;
};

type FileListProps = {
  files: DashboardFile[];
  selectedFile: string;
};

export function FileList({ files, selectedFile }: FileListProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-dashboard">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Uploaded Files</h2>
          <p className="mt-1 text-sm text-slate-600">Mock files shown for layout validation.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {files.length} files
        </span>
      </div>

      <div className="mt-5 divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
        {files.map((file) => {
          const isSelected = file.name === selectedFile;

          return (
            <button
              className={`grid w-full gap-2 px-4 py-3 text-left transition sm:grid-cols-[1fr_auto] ${
                isSelected ? "bg-azure-50" : "bg-white hover:bg-slate-50"
              }`}
              key={file.name}
              type="button"
            >
              <span>
                <span className="block text-sm font-semibold text-slate-950">{file.name}</span>
                <span className="mt-1 block text-xs text-slate-500">
                  {file.classification} / {file.uploadedAt}
                </span>
              </span>
              <span className="text-xs font-medium text-slate-500 sm:self-center">{file.size}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
