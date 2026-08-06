import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
];

export default function StudentProfilePage() {
  const dark = useTheme();
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [programme, setProgramme] = useState("");
  const [gpa, setGpa] = useState<string>("");
  const [experience, setExperience] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState<string>(user?.profilePicUrl || "");

  useEffect(() => {
    if (user?.id) {
      fetchStudentProfile();
    }
  }, [user?.id]);

  const fetchStudentProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/students/${user?.id}`);
      const p = res.data?.student || res.data;
      if (p) {
        setFirstName(p.firstName || "");
        setLastName(p.lastName || "");
        setPhone(p.phone || "");
        setStudentId(p.studentId || "");
        setIndexNumber(p.indexNumber || "");
        setProgramme(p.programme || "");
        setGpa(p.gpa ? String(p.gpa) : "");
        setExperience(p.experience || "");
        setCvUrl(p.cvUrl || "");
        if (p.profilePicUrl) {
          setProfilePicUrl(p.profilePicUrl);
        }
        updateUser({
          firstName: p.firstName || user?.firstName || "",
          lastName: p.lastName || user?.lastName || "",
          profilePicUrl: p.profilePicUrl || user?.profilePicUrl || "",
        });
      }
    } catch {
      if (!firstName && !lastName) {
        const nameParts = (user?.email?.split("@")[0] || "").split(".");
        setFirstName(nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : "");
        setLastName(nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : "Student");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      setProfilePicUrl(base64Data);
      updateUser({ profilePicUrl: base64Data });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (url: string) => {
    setProfilePicUrl(url);
    updateUser({ profilePicUrl: url });
  };

  const handleRemovePhoto = () => {
    setProfilePicUrl("");
    updateUser({ profilePicUrl: "" });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload = {
        firstName,
        lastName,
        phone,
        studentId,
        indexNumber,
        programme,
        gpa: gpa ? parseFloat(gpa) : null,
        experience,
        cvUrl,
        profilePicUrl,
      };

      const res = await api.put(`/api/students/${user?.id}`, payload);
      const updated = res.data?.student || payload;

      updateUser({
        firstName: updated.firstName || firstName,
        lastName: updated.lastName || lastName,
        profilePicUrl: updated.profilePicUrl || profilePicUrl,
      });

      setSuccessMsg("Profile details updated successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || err.response?.data?.error || "Failed to update profile. Please check your inputs."
      );
    } finally {
      setSaving(false);
    }
  };

  const initial = firstName.charAt(0) || user?.email?.charAt(0).toUpperCase() || "S";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 md:p-8 ${
            dark
              ? "bg-slate-900/70 border-slate-800/80"
              : "bg-white/80 border-slate-200/80 shadow-xs"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold bg-blue-500/10 border-blue-500/20 text-blue-400">
                <Sparkles size={13} />
                Student Portfolio
              </div>
              <h1
                className={`mt-2 text-2xl md:text-3xl font-extrabold tracking-tight ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                Student Profile
              </h1>
              <p
                className={`mt-1 text-xs md:text-sm font-medium ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Manage your profile picture, academic credentials, and placement resume.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Banners */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {/* Form Body */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Profile Picture Card */}
            <div
              className={`rounded-[24px] border p-6 space-y-4 ${
                dark
                  ? "bg-slate-900/60 border-slate-800/80"
                  : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <h2
                className={`text-sm font-extrabold uppercase tracking-wider ${
                  dark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Profile Photo
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500/20 bg-blue-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shrink-0">
                    {profilePicUrl ? (
                      <img
                        src={profilePicUrl}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initial
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all cursor-pointer">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-3 text-center sm:text-left flex-1">
                  <div>
                    <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                      Upload Profile Picture
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      JPG, PNG, or GIF up to 5MB. Photo will update across your dashboard topbar.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shadow-md shadow-blue-500/15">
                      <Upload size={14} /> Upload Custom Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    {profilePicUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 border border-rose-500/20"
                      >
                        <Trash2 size={13} /> Remove Photo
                      </button>
                    )}
                  </div>

                  {/* Preset Avatar Selection */}
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-2">
                      Or Choose a Preset Avatar
                    </span>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPresetAvatar(url)}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            profilePicUrl === url
                              ? "border-blue-500 scale-110 shadow-md shadow-blue-500/30"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details Card */}
            <div
              className={`rounded-[24px] border p-6 space-y-4 ${
                dark
                  ? "bg-slate-900/60 border-slate-800/80"
                  : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <h2
                className={`text-sm font-extrabold uppercase tracking-wider ${
                  dark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none opacity-60 cursor-not-allowed ${
                      dark ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+233 24 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Academic Information Card */}
            <div
              className={`rounded-[24px] border p-6 space-y-4 ${
                dark
                  ? "bg-slate-900/60 border-slate-800/80"
                  : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <h2
                className={`text-sm font-extrabold uppercase tracking-wider ${
                  dark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Academic Credentials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Student ID Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ST-1092837"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Index Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IDX-88273"
                    value={indexNumber}
                    onChange={(e) => setIndexNumber(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Academic Major / Programme
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Cumulative GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    placeholder="3.85"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Experience & Resume Card */}
            <div
              className={`rounded-[24px] border p-6 space-y-4 ${
                dark
                  ? "bg-slate-900/60 border-slate-800/80"
                  : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <h2
                className={`text-sm font-extrabold uppercase tracking-wider ${
                  dark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Experience & Resume Link
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Summary of Work / Project Experience
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your technical skills, key academic projects, leadership roles, or previous internships..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className={`w-full p-3.5 text-xs rounded-xl border outline-none resize-none leading-relaxed ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Curriculum Vitae (CV) / Portfolio URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/your-cv.pdf"
                    value={cvUrl}
                    onChange={(e) => setCvUrl(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
