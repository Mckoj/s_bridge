import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import {
  getCurrentRecruiterProfile,
  updateRecruiterProfile,
  uploadCompanyLogo,
  type RecruiterProfile,
} from "../../services/recruiterService";
import { PageHeader, LoadingSkeleton, ErrorState } from "../../components/recruiter";
import { Building, Upload, Save, CheckCircle2 } from "lucide-react";

export default function RecruiterSettingsPage() {
  const { user } = useAuth();
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const recruiterId = user?.id;

  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getCurrentRecruiterProfile();
        setProfile(data);
        setCompanyName(data.companyName || "");
        setCompanyWebsite(data.companyWebsite || "");
        setPosition(data.position || "");
        setDescription(data.description || "");
        setIndustry(data.industry || "");
        setSize(data.size || "");
        setAddress(data.address || "");
        setLogoUrl(data.logoUrl || "");
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingLogo(true);
    try {
      const url = await uploadCompanyLogo(file);
      setLogoUrl(url);
      setSuccessMsg("Company logo updated successfully.");
    } catch (err: any) {
      setError(err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    setSaving(true);
    setSuccessMsg("");
    setError(null);
    try {
      const updated = await updateRecruiterProfile(profile.id, {
        companyName,
        companyWebsite,
        position,
        description,
        industry,
        size,
        address,
        logoUrl,
      });
      setProfile(updated);
      setSuccessMsg("Company profile updated successfully.");
    } catch (err: any) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Company Profile"
          title="Account & Company Settings"
          description="Manage your recruiter profile, company details, brand logo, and workplace preferences."
        />

        {loading && <LoadingSkeleton count={3} layout="list" />}

        {error && !loading && <ErrorState error={error} />}

        {!loading && (
          <form onSubmit={handleSave} className="space-y-6">
            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                {successMsg}
              </div>
            )}

            {/* Company Logo & Basic Info */}
            <div className={`rounded-3xl border p-6 space-y-5 ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <h3 className={`text-base font-extrabold flex items-center gap-2 ${dark ? "text-white" : "text-slate-800"}`}>
                <Building size={18} className="text-emerald-500" />
                Company Branding
              </h3>

              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-extrabold text-2xl overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt={companyName} className="w-full h-full object-cover" />
                  ) : (
                    companyName[0] || "C"
                  )}
                </div>

                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-500/20 cursor-pointer">
                    <Upload size={14} />
                    {uploadingLogo ? "Uploading..." : "Upload Logo"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} disabled={uploadingLogo} />
                  </label>
                  <p className={`text-[11px] mt-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    PNG, JPG, or SVG up to 5MB. Rendered across your job postings.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Company Website</label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Your Title / Position</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. HR Manager / Talent Lead"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Technology / Banking"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Company Size</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 50-200 employees"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Office Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Airport Residential Area, Accra"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                    dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Company Overview / Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe your company's mission and internship opportunities..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                    dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving Changes..." : "Save Profile Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
