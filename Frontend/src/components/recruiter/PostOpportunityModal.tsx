import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import type { CreateInternshipPayload } from "../../services/recruiterService";
import { X, Plus, Sparkles } from "lucide-react";

interface PostOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateInternshipPayload) => Promise<void>;
  loading?: boolean;
}

export default function PostOpportunityModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: PostOpportunityModalProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [internshipType, setInternshipType] = useState("HYBRID");
  const [duration, setDuration] = useState("3 Months");
  const [salary, setSalary] = useState("");
  const [targetProgrammes, setTargetProgrammes] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim() || !description.trim() || !location.trim() || !duration.trim()) {
      setErrorMsg("Please fill in all required fields (Title, Description, Location, Duration).");
      return;
    }

    const skills = skillsStr
      ? skillsStr.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      await onSubmit({
        title,
        description,
        location,
        internshipType,
        duration,
        salary: salary ? Number(salary) : undefined,
        targetProgrammes,
        skills,
      });
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setSalary("");
      setSkillsStr("");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to post opportunity.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden ${
          dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        <div className={`p-6 border-b flex items-center justify-between ${dark ? "border-slate-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-500" />
            <h3 className="text-lg font-extrabold">Post New Internship Opportunity</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Engineering Intern"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Location *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Accra, Ghana / Remote"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                  dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Work Type *</label>
              <select
                value={internshipType}
                onChange={(e) => setInternshipType(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                  dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
                <option value="ON_SITE">On-Site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Duration *</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 Months, 6 Months"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                  dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Monthly Stipend (GHS / USD)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. 2000"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                  dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="e.g. React, Node.js, TypeScript, SQL"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Target Programmes</label>
            <input
              type="text"
              value={targetProgrammes}
              onChange={(e) => setTargetProgrammes(e.target.value)}
              placeholder="e.g. Computer Science, Electrical Engineering"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of responsibilities and requirements..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                dark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-600"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus size={14} />
              {loading ? "Publishing..." : "Publish Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
