import { ApiHealthBadge } from "@/components/ApiHealthBadge";
import { FileList } from "@/components/FileList";
import type { DashboardFile } from "@/components/FileList";
import { FileViewer } from "@/components/FileViewer";
import { StatusCard } from "@/components/StatusCard";
import { UploadPanel } from "@/components/UploadPanel";

const mockFiles: DashboardFile[] = [
  {
    name: "security-audit.json",
    size: "2.4 KB",
    classification: "confidential",
    uploadedAt: "2026-04-30",
  },
  {
    name: "access-review.json",
    size: "1.8 KB",
    classification: "internal",
    uploadedAt: "2026-04-29",
  },
  {
    name: "policy-snapshot.json",
    size: "3.1 KB",
    classification: "restricted",
    uploadedAt: "2026-04-28",
  },
];

const selectedContent = {
  id: "audit-1042",
  service: "secure-azure-file-dashboard-api",
  owner: "cloud-platform",
  classification: "confidential",
  controls: ["json-validation", "health-check", "stateless-api"],
  storageMode: "local-json",
};

const uploadPreview = {
  filename: "security-audit.json",
  content: selectedContent,
};

export default function Page() {
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
          </div>
          <ApiHealthBadge status="checking" label="API health" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(20rem,25rem)_1fr]">
        <div className="space-y-6">
          <StatusCard
            title="Phase 3 preview"
            message="This UI uses mock data only. Phase 4 will wire these components to NEXT_PUBLIC_API_URL and the Azure Functions endpoints."
          />
          <UploadPanel filename={uploadPreview.filename} preview={JSON.stringify(uploadPreview, null, 2)} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(18rem,24rem)_1fr]">
          <FileList files={mockFiles} selectedFile="security-audit.json" />
          <FileViewer filename="security-audit.json" content={selectedContent} />
        </div>
      </section>
    </main>
  );
}
