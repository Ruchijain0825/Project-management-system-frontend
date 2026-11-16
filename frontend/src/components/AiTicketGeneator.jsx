
import { useState } from "react";
import { X, Sparkles, WandSparkles, Loader2, Plus } from "lucide-react";
import api from "../services/api";

const AITicketGenerator = ({
  projectId,
  onClose,
  onCreated
}) => {
  const [problem, setProblem] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const generateTicket = async () => {
    if (problem.trim().length < 10) {
      setError("Please describe the issue in at least 10 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTicket(null);

      const response = await api.post(
        "/ai/generate-ticket",
        {
          projectId,
          problem: problem.trim()
        }
      );

      setTicket(response.data.ticket);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to generate ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  const approveTicket = async () => {
    if (!ticket || !projectId) return;

    try {
      setSaving(true);
      setError("");

      // Save only actual Ticket model fields.
      await api.post("/tickets", {
        title: ticket.title,
        description: ticket.description,
        type: ticket.type,
        priority: ticket.priority,
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
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center gap-3">
            <div className="bg-yellow-400/10 p-3 rounded-xl">
              <Sparkles className="text-yellow-400" size={25} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                AI Ticket Generator
              </h2>
              <p className="text-sm text-slate-400">
                Convert your problem into a structured ticket
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={22} />
          </button>

        </div>

        {/* Problem input */}
        <label className="block text-sm text-slate-300 mb-2">
          Describe your issue
        </label>

        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Example: Login button is not working and API returns 401 error..."
          rows={5}
          maxLength={4000}
          className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-yellow-400 resize-none"
        />

        <p className="text-xs text-slate-500 text-right mt-1">
          {problem.length}/4000
        </p>

        {/* Generate button */}
        <button
          type="button"
          onClick={generateTicket}
          disabled={loading || !projectId}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-yellow-400 text-black p-3 rounded-xl font-bold hover:bg-yellow-300 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <WandSparkles size={18} />
              Generate with AI
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* AI Preview */}
        {ticket && (
          <div className="mt-6 border border-slate-700 rounded-xl p-5 space-y-4">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Generated Ticket Preview
              </h3>

              <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full">
                AI Generated
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-400">
                Title
              </label>

              <input
                value={ticket.title}
                onChange={(e) =>
                  setTicket({
                    ...ticket,
                    title: e.target.value
                  })
                }
                maxLength={150}
                className="w-full mt-1 p-3 bg-slate-800 rounded-lg text-white border border-slate-700"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">
                Description
              </label>

              <textarea
                value={ticket.description}
                onChange={(e) =>
                  setTicket({
                    ...ticket,
                    description: e.target.value
                  })
                }
                maxLength={3000}
                rows={4}
                className="w-full mt-1 p-3 bg-slate-800 rounded-lg text-white border border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="text-xs text-slate-400">
                  Issue Type
                </label>

                <select
                  value={ticket.type}
                  onChange={(e) =>
                    setTicket({
                      ...ticket,
                      type: e.target.value
                    })
                  }
                  className="w-full mt-1 p-3 bg-slate-800 rounded-lg text-white"
                >
                  <option value="Bug">Bug</option>
                  <option value="Feature">Feature</option>
                  <option value="Task">Task</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">
                  Priority
                </label>

                <select
                  value={ticket.priority}
                  onChange={(e) =>
                    setTicket({
                      ...ticket,
                      priority: e.target.value
                    })
                  }
                  className="w-full mt-1 p-3 bg-slate-800 rounded-lg text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

            </div>

            {/* Suggested investigation */}
            {ticket.suggestedSteps?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  Suggested investigation
                </h4>

                <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                  {ticket.suggestedSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Acceptance criteria */}
            {ticket.acceptanceCriteria?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">
                  Acceptance criteria
                </h4>

                <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
                  {ticket.acceptanceCriteria.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={approveTicket}
              disabled={saving || ticket.title.trim().length < 3}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white p-3 rounded-xl font-bold hover:bg-green-400 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating Ticket...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Approve & Create Ticket
                </>
              )}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default AITicketGenerator;
