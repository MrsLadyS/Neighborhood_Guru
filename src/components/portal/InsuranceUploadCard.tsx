"use client";

import { useCallback, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type InsuranceDoc = {
  id: string;
  file_name: string;
  file_path: string;
  policy_number: string | null;
  created_at: string;
};

type Props = {
  email: string;
  approvalCode: string;
};

function sanitizeSegment(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}

export function InsuranceUploadCard({ email, approvalCode }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [policyNumber, setPolicyNumber] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [docs, setDocs] = useState<InsuranceDoc[]>([]);

  const canUsePortalIdentity = Boolean(email && approvalCode);

  const refreshDocs = useCallback(async () => {
    if (!canUsePortalIdentity) {
      setDocs([]);
      return;
    }
    const { data } = await supabase
      .from("insurance_documents")
      .select("id, file_name, file_path, policy_number, created_at")
      .eq("email", email)
      .eq("approval_code", approvalCode)
      .order("created_at", { ascending: false });
    setDocs((data as InsuranceDoc[] | null) ?? []);
  }, [approvalCode, canUsePortalIdentity, email, supabase]);

  async function submitUpload() {
    if (!file || !canUsePortalIdentity) return;
    setUploading(true);
    setMessage("");
    try {
      const stamp = Date.now();
      const safeEmail = sanitizeSegment(email);
      const safeCode = sanitizeSegment(approvalCode);
      const safeFile = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const filePath = `${safeEmail}/${safeCode}/${stamp}-${safeFile}`;

      const uploadResult = await supabase.storage
        .from("tenant-documents")
        .upload(filePath, file, { upsert: false });
      if (uploadResult.error) throw uploadResult.error;

      const insertResult = await supabase.from("insurance_documents").insert({
        email,
        approval_code: approvalCode,
        policy_number: policyNumber.trim() || null,
        file_name: file.name,
        file_path: filePath,
      });
      if (insertResult.error) throw insertResult.error;

      setMessage("Insurance document uploaded.");
      setFile(null);
      setPolicyNumber("");
      setOpen(false);
      await refreshDocs();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setMessage(msg);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <h3 className="font-display text-xl text-[var(--brand-ink)]">Insurance policy management</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Insurance must be listed as payable to <strong>NeighborhoodGuru LLC</strong>, PO box 80,
        Greenfield Park, NY, 12435.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!canUsePortalIdentity}
          onClick={async () => {
            await refreshDocs();
            setOpen(true);
          }}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-ink)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Upload insurance document
        </button>
        <button
          type="button"
          disabled={!canUsePortalIdentity}
          onClick={refreshDocs}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-ink)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Refresh uploads
        </button>
      </div>
      {!canUsePortalIdentity && (
        <p className="mt-3 text-sm text-[var(--muted)]">
          Enter email and approval code in Rental status above to enable uploads.
        </p>
      )}
      {message && <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>}

      {docs.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
          {docs.map((doc) => (
            <li key={doc.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2">
              <span className="font-medium text-[var(--brand-ink)]">{doc.file_name}</span>
              {doc.policy_number ? ` · Policy ${doc.policy_number}` : ""}
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-white p-6 shadow-lg">
            <h4 className="font-display text-2xl text-[var(--brand-ink)]">Upload insurance</h4>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Drop a file or choose one from your device.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const dropped = e.dataTransfer.files?.[0] ?? null;
                setFile(dropped);
              }}
              className={`mt-4 rounded-xl border-2 border-dashed p-6 text-center text-sm ${
                dragging ? "border-[var(--brand-deep)] bg-[var(--surface-2)]" : "border-[var(--border)]"
              }`}
            >
              {file ? `Selected: ${file.name}` : "Drag and drop file here"}
              <div className="mt-3">
                <label className="cursor-pointer rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-ink)]">
                  Choose file
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="policy_number" className="block text-sm font-medium text-[var(--brand-ink)]">
                Policy number (optional)
              </label>
              <input
                id="policy_number"
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-ink)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!file || uploading}
                onClick={submitUpload}
                className="rounded-full bg-[var(--brand-deep)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload file"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
