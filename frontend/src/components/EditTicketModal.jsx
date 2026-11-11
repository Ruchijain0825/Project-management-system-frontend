
import { useState } from "react";
import { X } from "lucide-react";
import api from "../services/api";

const EditTicketModal = ({ ticket, onClose, onUpdated }) => {

  const [form, setForm] = useState({
    title: ticket.title,
    description: ticket.description || "",
    priority: ticket.priority,
    status: ticket.status,
    type: ticket.type
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.put(`/tickets/${ticket._id}`, form);

      await onUpdated();

      onClose();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6">

        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Edit Ticket
          </h2>

          <button onClick={onClose}>
            <X className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            value={form.title}
            onChange={e => setForm({
              ...form,
              title: e.target.value
            })}
            required
            minLength={3}
            maxLength={150}
            className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
          />

          <textarea
            value={form.description}
            onChange={e => setForm({
              ...form,
              description: e.target.value
            })}
            maxLength={3000}
            rows={4}
            className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
          />

          <div className="grid grid-cols-2 gap-3">

            <select
              value={form.priority}
              onChange={e => setForm({
                ...form,
                priority: e.target.value
              })}
              className="p-3 rounded-lg bg-slate-800 text-white"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>

            <select
              value={form.status}
              onChange={e => setForm({
                ...form,
                status: e.target.value
              })}
              className="p-3 rounded-lg bg-slate-800 text-white"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

          </div>

          <select
            value={form.type}
            onChange={e => setForm({
              ...form,
              type: e.target.value
            })}
            className="w-full p-3 rounded-lg bg-slate-800 text-white"
          >
            <option>Bug</option>
            <option>Feature</option>
            <option>Task</option>
          </select>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-yellow-400 text-black p-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default EditTicketModal;
