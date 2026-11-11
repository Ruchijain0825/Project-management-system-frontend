
import { useState } from "react";
import { X } from "lucide-react";
import api from "../services/api";

const CreateTicketModal = ({
  projectId,
  onClose,
  onCreated
}) => {

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Bug",
    priority: "Medium"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/tickets", {
        ...form,
        projectId
      });

      await onCreated();
      onClose();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-bold text-white">
            Create New Ticket
          </h2>

          <button onClick={onClose}>
            <X className="text-slate-400" />
          </button>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ticket title"
            minLength={3}
            maxLength={150}
            required
            className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue..."
            maxLength={3000}
            rows={4}
            className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
          />

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-slate-400">
                Issue Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-slate-800 text-white rounded-lg"
              >
                <option>Bug</option>
                <option>Feature</option>
                <option>Task</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-slate-800 text-white rounded-lg"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full p-3 bg-yellow-400 text-black font-bold rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default CreateTicketModal;
