
import { useState } from "react";
import { X, Ticket, Loader2 } from "lucide-react";
import api from "../services/api";

export default function CreateTicketModal({
  projectId,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Bug",
    priority: "Medium",
    status: "To Do",
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

    if (!projectId) {
      setError("Please select a project first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/tickets", {
        ...form,
        projectId,
      });

      await onCreated?.();
      onClose();
    } catch (err) {
      console.error("Create ticket error:", err);
      setError(
        err.response?.data?.message || "Failed to create ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-400 p-2 text-black">
              <Ticket size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Create Ticket</h2>
              <p className="text-sm text-slate-400">
                Add a new task to your project
              </p>
            </div>
          </div>

          <button onClick={onClose} type="button">
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Ticket Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Fix login authentication"
              minLength={3}
              maxLength={150}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 outline-none focus:border-yellow-400"
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
              placeholder="Describe this ticket..."
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
              >
                <option value="Bug">Bug</option>
                <option value="Feature">Feature</option>
                <option value="Task">Task</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-2 font-semibold text-black hover:bg-yellow-300 disabled:opacity-60"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
