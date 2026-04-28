"use client";

import { useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type BookingRef = {
  property_id: string;
  property_name: string;
  city: string | null;
};

type WaiverAck = {
  id: string;
  waiver_key: string;
  waiver_version: string;
  signer_name: string;
  signer_email: string;
  accepted_at: string;
};

type Invite = {
  id: string;
  invited_email: string;
  invitation_token: string;
  created_at: string;
};

type Props = {
  email: string;
  approvalCode: string;
  applicableBookings: BookingRef[];
};

type WaiverDef = {
  key: string;
  title: string;
  version: string;
  body: string;
};

const WAIVERS: WaiverDef[] = [
  {
    key: "atv_utv_release",
    title: "ATV/UTV Release of Liability",
    version: "2026-04-28-v1",
    body: `ATV/UTV RELEASE OF LIABILITY

By participating in any ATV or UTV activity on or near the rental property, I acknowledge and agree:

1) Motorized off-road vehicle activity involves inherent risks, including serious injury or death.
2) I voluntarily assume all risks related to ATV/UTV operation, riding, loading, and unloading.
3) I am responsible for safe operation, proper protective gear, and compliance with all laws/rules.
4) NeighborhoodGuru LLC and associated property owners/managers do not provide on-premises activity management or active supervision.
5) Activities are undertaken at my own risk.
6) To the fullest extent permitted by law, I release and hold harmless NeighborhoodGuru LLC, property owners, managers, and affiliates from claims arising from ATV/UTV activity, including negligence claims except where prohibited by law.

I confirm I have read and understood this release and agree to its terms.`,
  },
  {
    key: "animal_horse_release",
    title: "Animal and Horse Interaction Waiver",
    version: "2026-04-28-v1",
    body: `ANIMAL AND HORSE INTERACTION WAIVER

By participating in any activity involving animals (including horses), I acknowledge and agree:

1) Animal interaction carries inherent risks, including falls, bites, kicks, and unpredictable behavior.
2) I voluntarily assume all risks from proximity, handling, feeding, and riding activities.
3) I am responsible for following safety instructions and using good judgment around animals.
4) All animals brought onto the premises must have current, up-to-date immunizations.
5) NeighborhoodGuru LLC and associated property owners/managers do not provide on-premises activity management or supervision.
6) Activities are undertaken at my own risk.
7) To the fullest extent permitted by law, I release and hold harmless NeighborhoodGuru LLC, property owners, managers, and affiliates from claims arising from these activities, including negligence claims except where prohibited by law.

I confirm I have read and understood this waiver and agree to its terms.`,
  },
  {
    key: "general_premises_release",
    title: "General Premises and Activity Risk Acknowledgment",
    version: "2026-04-28-v1",
    body: `GENERAL PREMISES AND ACTIVITY RISK ACKNOWLEDGMENT

I acknowledge and agree:

1) The property may include outdoor terrain, woods, water features, equipment, and natural hazards.
2) I accept all risks associated with use of the premises and any optional activities.
3) NeighborhoodGuru LLC and associated property owners/managers do not provide on-premises management or active supervision.
4) Occupancy and activities are at my own risk.
5) I am responsible for the safety and conduct of myself and my party.
6) To the fullest extent permitted by law, I release and hold harmless NeighborhoodGuru LLC, property owners, managers, and affiliates from claims arising from my use of the property and activities, including negligence claims except where prohibited by law.

I confirm I have read and understood this acknowledgment and agree to its terms.`,
  },
];

export function WaiverManagerCard({ email, approvalCode, applicableBookings }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [acks, setAcks] = useState<WaiverAck[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [active, setActive] = useState<WaiverDef | null>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [busy, setBusy] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [message, setMessage] = useState("");
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const canUsePortalIdentity = Boolean(email && approvalCode);
  const primaryPropertyId = applicableBookings[0]?.property_id ?? null;

  async function refreshTracking() {
    if (!canUsePortalIdentity) return;
    const [ackRes, inviteRes] = await Promise.all([
      supabase
        .from("waiver_acknowledgements")
        .select("id, waiver_key, waiver_version, signer_name, signer_email, accepted_at")
        .eq("approval_code", approvalCode)
        .eq("signer_email", email)
        .order("accepted_at", { ascending: false }),
      supabase
        .from("waiver_invites")
        .select("id, invited_email, invitation_token, created_at")
        .eq("approval_code", approvalCode)
        .eq("invited_by_email", email)
        .order("created_at", { ascending: false }),
    ]);
    setAcks((ackRes.data as WaiverAck[] | null) ?? []);
    setInvites((inviteRes.data as Invite[] | null) ?? []);
  }

  async function openWaiver(w: WaiverDef) {
    setActive(w);
    setAtBottom(false);
    setConfirm(false);
    setSignerName("");
    setHasDrawnSignature(false);
    setIsDrawing(false);
    // If content doesn't overflow, treat reading requirement as satisfied.
    requestAnimationFrame(() => {
      const el = document.getElementById("waiver-scroll-body");
      if (!el) return;
      const requiresScroll = el.scrollHeight > el.clientHeight + 4;
      if (!requiresScroll) {
        setAtBottom(true);
      }
      const canvas = signatureCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    });
    await refreshTracking();
  }

  async function signWaiver() {
    if (!active || !canUsePortalIdentity) return;
    const signatureDataUrl = signatureCanvasRef.current?.toDataURL("image/png") ?? null;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.from("waiver_acknowledgements").insert({
      waiver_key: active.key,
      waiver_version: active.version,
      signer_name: signerName.trim(),
      signer_email: email,
      approval_code: approvalCode,
      property_id: primaryPropertyId,
      signature_data_url: signatureDataUrl,
      waiver_body_snapshot: active.body,
    });
    setBusy(false);
    if (error) {
      setMessage("Could not record waiver acknowledgment. Please try again.");
      return;
    }
    setMessage("Waiver acknowledgment recorded.");
    setActive(null);
    await refreshTracking();
    router.refresh();
  }

  async function sendInvites() {
    if (!canUsePortalIdentity) return;
    const emails = inviteEmails
      .split(/[\n,; ]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (emails.length === 0) {
      setMessage("Add at least one adult email address.");
      return;
    }
    setBusy(true);
    setMessage("");
    const rows = emails.map((invited_email) => ({
      invited_email,
      invited_by_email: email,
      approval_code: approvalCode,
      property_id: primaryPropertyId,
    }));
    const { error } = await supabase.from("waiver_invites").insert(rows);
    setBusy(false);
    if (error) {
      setMessage("Could not save waiver invite emails. Please try again.");
      return;
    }
    setInviteEmails("");
    setMessage("Waiver invite emails saved.");
    await refreshTracking();
  }

  const signedKeys = new Set(acks.map((a) => a.waiver_key));

  function getCanvasPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startSignature(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = signatureCanvasRef.current;
    const point = getCanvasPoint(e);
    if (!canvas || !point) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#1f2f56";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    setIsDrawing(true);
    setHasDrawnSignature(true);
  }

  function drawSignature(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    const point = getCanvasPoint(e);
    if (!canvas || !point) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  function endSignature() {
    setIsDrawing(false);
  }

  function clearSignature() {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
    setIsDrawing(false);
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <h3 className="font-display text-xl text-[var(--brand-ink)]">Waivers</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        All adults on premises are required to review and sign required waivers before final approval.
      </p>
      {!canUsePortalIdentity && (
        <p className="mt-3 text-sm text-[var(--muted)]">
          Enter your email and approval code in Rental status above to unlock waiver signing.
        </p>
      )}
      <ul className="mt-4 space-y-2">
        {WAIVERS.map((w) => (
          <li key={w.key} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
            <div>
              <p className="font-medium text-[var(--brand-ink)]">{w.title}</p>
              <p className="text-[var(--muted)]">Version {w.version}</p>
            </div>
            <button
              type="button"
              disabled={!canUsePortalIdentity}
              onClick={() => openWaiver(w)}
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--brand-ink)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {signedKeys.has(w.key) ? "Review signed" : "Review and sign"}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <p className="text-sm font-medium text-[var(--brand-ink)]">Add all adults on premises</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          All adults on premises are required to have a signed/acknowledged waiver. Add emails here.
        </p>
        <textarea
          value={inviteEmails}
          onChange={(e) => setInviteEmails(e.target.value)}
          placeholder="adult1@email.com, adult2@email.com"
          rows={3}
          className="mt-3 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
        />
        <button
          type="button"
          disabled={!canUsePortalIdentity || busy}
          onClick={sendInvites}
          className="mt-3 rounded-full bg-[var(--brand-deep)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save waiver recipients
        </button>
        {invites.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
            {invites.map((inv) => (
              <li key={inv.id}>
                {inv.invited_email} - waiver link token {inv.invitation_token.slice(0, 8)}...
              </li>
            ))}
          </ul>
        )}
      </div>
      {message && <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>}

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-white p-6 shadow-lg">
            <h4 className="font-display text-2xl text-[var(--brand-ink)]">{active.title}</h4>
            <p className="mt-1 text-sm text-[var(--muted)]">Version {active.version}</p>
            <div
              id="waiver-scroll-body"
              className="mt-4 max-h-[45vh] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm leading-relaxed text-[var(--muted)]"
              onScroll={(e) => {
                const el = e.currentTarget;
                const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
                if (reachedBottom) setAtBottom(true);
              }}
            >
              {active.body.split("\n").map((line, i) => (
                <p key={i} className="mb-2">
                  {line}
                </p>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <label className="inline-flex items-start gap-2 text-sm text-[var(--brand-ink)]">
                <input
                  type="checkbox"
                  checked={confirm}
                  onChange={(e) => setConfirm(e.target.checked)}
                  disabled={!atBottom}
                  className="mt-0.5 accent-[var(--brand-deep)]"
                />
                <span>I have scrolled through and read the waiver, and I agree to all terms.</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-[var(--brand-ink)]">Print full legal name</label>
                <input
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-sm font-medium text-[var(--brand-ink)]">
                    Draw signature
                  </label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--brand-ink)]"
                  >
                    Clear signature
                  </button>
                </div>
                <canvas
                  ref={signatureCanvasRef}
                  width={900}
                  height={180}
                  onPointerDown={startSignature}
                  onPointerMove={drawSignature}
                  onPointerUp={endSignature}
                  onPointerLeave={endSignature}
                  className="mt-1.5 h-40 w-full rounded-xl border border-[var(--border)] bg-white touch-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-ink)]"
              >
                Close
              </button>
              <button
                type="button"
                disabled={!atBottom || !confirm || !signerName.trim() || !hasDrawnSignature || busy}
                onClick={signWaiver}
                className="rounded-full bg-[var(--brand-deep)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Saving..." : "Acknowledge and sign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
