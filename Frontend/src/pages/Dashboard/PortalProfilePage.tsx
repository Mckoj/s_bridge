import { useState } from "react";
import { AlertCircle, Camera, CheckCircle2, Save, Sparkles, Trash2, Upload } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";

type Portal = "university" | "recruiter" | "admin";

interface PortalProfilePageProps {
  portal: Portal;
}

const portalConfig = {
  university: {
    name: "University",
    label: "University Account",
    description: "Manage your institution profile, contact details, and placement office information.",
    detailsHeading: "Institution Information",
    firstField: "Institution Name",
    secondField: "Department / Office",
    firstPlaceholder: "e.g. SBridge University",
    secondPlaceholder: "e.g. Career Services",
    accent: {
      badge: "bg-purple-500/10 border-purple-500/20 text-purple-400",
      button: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20",
      border: "border-purple-500/20",
      avatar: "bg-purple-600",
      focus: "focus:border-purple-500",
      spinner: "border-purple-500/30 border-t-purple-500",
      success: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    },
  },
  recruiter: {
    name: "Recruiter",
    label: "Company Profile",
    description: "Manage your company identity, recruiter contact details, and hiring information.",
    detailsHeading: "Company Information",
    firstField: "Company Name",
    secondField: "Industry",
    firstPlaceholder: "e.g. SBridge Technologies",
    secondPlaceholder: "e.g. Software & IT Services",
    accent: {
      badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
      border: "border-emerald-500/20",
      avatar: "bg-emerald-600",
      focus: "focus:border-emerald-500",
      spinner: "border-emerald-500/30 border-t-emerald-500",
      success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    },
  },
  admin: {
    name: "Administrator",
    label: "System Administration",
    description: "Manage your administrator identity, support contact details, and system profile.",
    detailsHeading: "Administrator Information",
    firstField: "Display Name",
    secondField: "Administrative Area",
    firstPlaceholder: "e.g. System Administrator",
    secondPlaceholder: "e.g. Platform Operations",
    accent: {
      badge: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      button: "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20",
      border: "border-rose-500/20",
      avatar: "bg-rose-600",
      focus: "focus:border-rose-500",
      spinner: "border-rose-500/30 border-t-rose-500",
      success: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    },
  },
} as const;

/**
 * Shared presentation behind portal-specific wrappers. It deliberately keeps
 * the student profile's visual hierarchy without sending unsupported fields to
 * an endpoint owned by a different portal.
 */
export default function PortalProfilePage({ portal }: PortalProfilePageProps) {
  const { user, updateUser } = useAuth();
  const { theme } = useDashboard();
  const dark = theme === "dark";
  const config = portalConfig[portal];
  const { accent } = config;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "";
  const [displayName, setDisplayName] = useState(name);
  const [contactName, setContactName] = useState(name);
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profilePicUrl || "");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const initial = (displayName || user?.email || config.name).charAt(0).toUpperCase();
  const cardClass = dark ? "border-slate-800/80 bg-slate-900/60" : "border-slate-200 bg-white shadow-xs";
  const inputClass = `${dark ? "bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"} w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none transition-colors`;
  const labelClass = `block text-[10px] font-extrabold uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-400"}`;

  const updatePhoto = (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const photo = String(reader.result || "");
      setProfilePicUrl(photo);
      updateUser({ profilePicUrl: photo });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    const [firstName = "", ...remainingName] = contactName.trim().split(/\s+/);
    window.setTimeout(() => {
      updateUser({ firstName, lastName: remainingName.join(" "), profilePicUrl });
      setSaving(false);
      setSuccessMsg("Profile details updated successfully.");
    }, 250);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <header className={`relative overflow-hidden rounded-[28px] border p-6 md:p-8 ${dark ? "bg-slate-900/70 border-slate-800/80" : "bg-white/80 border-slate-200/80 shadow-xs"}`}>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${accent.badge}`}><Sparkles size={13} />{config.label}</span>
          <h1 className={`mt-2 text-2xl font-extrabold tracking-tight md:text-3xl ${dark ? "text-white" : "text-slate-800"}`}>{config.name} Profile</h1>
          <p className={`mt-1 text-xs font-medium md:text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{config.description}</p>
        </header>

        {successMsg && <div role="status" className={`flex items-center gap-2 rounded-2xl border p-4 text-xs font-bold ${accent.success}`}><CheckCircle2 size={16} />{successMsg}</div>}
        {errorMsg && <div role="alert" className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-bold text-rose-400"><AlertCircle size={16} />{errorMsg}</div>}

        <form onSubmit={handleSave} className="space-y-6">
          <section className={`space-y-4 rounded-[24px] border p-6 ${cardClass}`}>
            <h2 className={`text-sm font-extrabold uppercase tracking-wider ${dark ? "text-slate-300" : "text-slate-700"}`}>Profile Photo</h2>
            <div className="flex flex-col items-center gap-6 pt-2 sm:flex-row">
              <div className="relative">
                <div className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 ${accent.border} ${accent.avatar} text-3xl font-extrabold text-white shadow-xl`}>
                  {profilePicUrl ? <img src={profilePicUrl} alt="Profile avatar" className="h-full w-full object-cover" /> : initial}
                </div>
                <label aria-label="Upload profile photo" className={`absolute bottom-0 right-0 cursor-pointer rounded-full p-2 text-white shadow-lg ${accent.button}`}><Camera size={14} /><input type="file" accept="image/*" onChange={(event) => updatePhoto(event.target.files?.[0])} className="hidden" /></label>
              </div>
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div><h3 className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>Upload Profile Picture</h3><p className={`mt-0.5 text-xs ${dark ? "text-slate-400" : "text-slate-400"}`}>JPG, PNG, or GIF up to 5MB. Your photo is used in the dashboard top bar.</p></div>
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md ${accent.button}`}><Upload size={14} />Upload Photo<input type="file" accept="image/*" onChange={(event) => updatePhoto(event.target.files?.[0])} className="hidden" /></label>
                  {profilePicUrl && <button type="button" onClick={() => { setProfilePicUrl(""); updateUser({ profilePicUrl: "" }); }} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-500/20"><Trash2 size={13} />Remove Photo</button>}
                </div>
              </div>
            </div>
          </section>

          <section className={`space-y-4 rounded-[24px] border p-6 ${cardClass}`}>
            <h2 className={`text-sm font-extrabold uppercase tracking-wider ${dark ? "text-slate-300" : "text-slate-700"}`}>Contact Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Contact Name" labelClass={labelClass}><input required value={contactName} onChange={(event) => setContactName(event.target.value)} className={`${inputClass} ${accent.focus}`} /></Field>
              <Field label="Email Address (Account ID)" labelClass={labelClass}><input disabled value={user?.email || ""} className={`${inputClass} cursor-not-allowed opacity-60`} /></Field>
              <Field label="Phone Number" labelClass={labelClass}><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+233 24 000 0000" className={`${inputClass} ${accent.focus}`} /></Field>
              <Field label="Website" labelClass={labelClass}><input type="url" value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://example.com" className={`${inputClass} ${accent.focus}`} /></Field>
            </div>
          </section>

          <section className={`space-y-4 rounded-[24px] border p-6 ${cardClass}`}>
            <h2 className={`text-sm font-extrabold uppercase tracking-wider ${dark ? "text-slate-300" : "text-slate-700"}`}>{config.detailsHeading}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={config.firstField} labelClass={labelClass}><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder={config.firstPlaceholder} className={`${inputClass} ${accent.focus}`} /></Field>
              <Field label={config.secondField} labelClass={labelClass}><input placeholder={config.secondPlaceholder} className={`${inputClass} ${accent.focus}`} /></Field>
            </div>
            <Field label="Profile Summary" labelClass={labelClass}><textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe your role, organisation, services, or area of responsibility..." className={`${inputClass} ${accent.focus} resize-none leading-relaxed`} /></Field>
          </section>

          <div className="flex justify-end pt-2"><button type="submit" disabled={saving} className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold text-white shadow-lg transition-all disabled:opacity-50 ${accent.button}`}>{saving ? <span className={`h-4 w-4 animate-spin rounded-full border-2 border-white/30 ${accent.spinner}`} /> : <><Save size={15} />Save Changes</>}</button></div>
        </form>
      </div>
    </DashboardLayout>
  );
}

function Field({ label, labelClass, children }: { label: string; labelClass: string; children: React.ReactNode }) {
  return <label className="space-y-1.5"><span className={labelClass}>{label}</span>{children}</label>;
}
