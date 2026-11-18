
import { useState } from "react";
import { X, FolderPlus, Loader2 } from "lucide-react";
import api from "../services/api";

export default function CreateProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Active",
    visibility: "Private",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.title.trim().length < 3) {
      setError("Project name must have at least 3 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/projects", {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        visibility: form.visibility,
      });

      await onCreated?.();
      onClose();

    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#101A32]">

        <div className="flex items-center justify-between border-b border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <FolderPlus className="text-yellow-400" size={24} />
            <div>
              <h2 className="font-bold text-white">Create Project</h2>
              <p className="text-xs text-slate-400">
                Create your new workspace
              </p>
            </div>
          </div>

          <button type="button" onClick={onClose}>
            <X className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Project Name *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter project name"
              required
              maxLength={100}
              className="w-full rounded-lg border border-slate-700 bg-[#0B1428] p-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your project..."
              rows={4}
              maxLength={1000}
              className="w-full rounded-lg border border-slate-700 bg-[#0B1428] p-3 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-[#0B1428] p-3 text-white"
              >
                <option>Active</option>
                <option>Completed</option>
                <option>Archived</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Visibility
              </label>
              <select
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-[#0B1428] p-3 text-white"
              >
                <option>Private</option>
                <option>Team</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-2 font-bold text-black disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
