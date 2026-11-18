
import { MessageSquare, Pencil } from "lucide-react";

const TicketCard = ({ ticket, onClick }) => {
  if (!ticket) return null;

  const ticketId = String(ticket._id || ticket.id || "unknown");

  const priorityColors = {
    Low: "text-blue-400 bg-blue-400/10",
    Medium: "text-yellow-400 bg-yellow-400/10",
    High: "text-orange-400 bg-orange-400/10",
    Critical: "text-red-400 bg-red-400/10",
  };

  const statusColors = {
    "To Do": "text-slate-300 bg-slate-700",
    "In Progress": "text-blue-400 bg-blue-400/10",
    Done: "text-green-400 bg-green-400/10",
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-yellow-400 transition cursor-pointer"
    >
      <div className="flex justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 mb-2">
            {ticket.type || "Task"} · #{ticketId.slice(-6).toUpperCase()}
          </p>

          <h3 className="text-white font-semibold break-words">
            {ticket.title || "Untitled Ticket"}
          </h3>
        </div>

        <span
          className={`h-fit shrink-0 px-3 py-1 rounded-full text-xs ${
            priorityColors[ticket.priority] || "text-gray-300 bg-gray-700"
          }`}
        >
          {ticket.priority || "Medium"}
        </span>
      </div>

      <p className="text-sm text-slate-400 mt-3 break-words">
        {ticket.description || "No description"}
      </p>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800">
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            statusColors[ticket.status] || "text-gray-300 bg-gray-700"
          }`}
        >
          {ticket.status || "To Do"}
        </span>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1 text-xs">
            <MessageSquare size={15} />
            Comments
          </span>
          <Pencil size={15} />
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
