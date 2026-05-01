type FileViewerProps = {
  filename: string;
  content: unknown;
};

export function FileViewer({ filename, content }: FileViewerProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-dashboard">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-slate-950">File Viewer</h2>
        <p className="text-sm text-slate-600">{filename}</p>
      </div>

      <pre className="mt-5 max-h-[28rem] overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-50">
        <code>{JSON.stringify(content, null, 2)}</code>
      </pre>
    </section>
  );
}
