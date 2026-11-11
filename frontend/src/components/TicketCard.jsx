
import { MessageSquare, Pencil } from "lucide-react";

const TicketCard = ({ ticket, onClick }) => {

  const priorityColors = {
    Low: "text-blue-400 bg-blue-400/10",
    Medium: "text-yellow-400 bg-yellow-400/10",
    High: "text-orange-400 bg-orange-400/10",
    Critical: "text-red-400 bg-red-400/10"
  };

  const statusColors = {
    "To Do": "text-slate-300 bg-slate-700",
    "In Progress": "text-blue-400 bg-blue-400/10",
    Done: "text-green-400 bg-green-400/10"
  };

  return (
    <div
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-yellow-400 transition cursor-pointer"
    >

      <div className="flex justify-between gap-3">

        <div>
          <p className="text-xs text-slate-500 mb-2">
            {ticket.type} · #{ticket._id.slice(-6).toUpperCase()}
          </p>

          <h3 className="text-white font-semibold">
            {ticket.title}
          </h3>
        </div>

        <span className={`h-fit px-3 py-1 rounded-full text-xs ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </span>

      </div>

      <p className="text-sm text-slate-400 mt-3">
        {ticket.description || "No description"}
      </p>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800">

        <span className={`px-3 py-1 rounded-full text-xs ${statusColors[ticket.status]}`}>
          {ticket.status}
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
