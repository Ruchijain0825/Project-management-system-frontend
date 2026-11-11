
import { X, Pencil, Trash2 } from "lucide-react";
import TicketComments from "./TicketComments";

const TicketDetailsModal = ({
  ticket,
  onClose,
  onEdit,
  onDelete
}) => {

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">

      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 my-8">

        <div className="flex justify-between items-center mb-6">

          <div>
            <p className="text-xs text-slate-500">
              TICKET #{ticket._id.slice(-6).toUpperCase()}
            </p>

            <h2 className="text-xl font-bold text-white mt-1">
              {ticket.title}
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="text-slate-400" />
          </button>

        </div>

        <p className="text-slate-300 mb-5">
          {ticket.description || "No description"}
        </p>

        <div className="flex flex-wrap gap-3 mb-6 text-sm">

          <span className="bg-slate-800 px-3 py-2 rounded-lg text-yellow-400">
            {ticket.priority}
          </span>

          <span className="bg-slate-800 px-3 py-2 rounded-lg text-blue-400">
            {ticket.status}
          </span>

          <span className="bg-slate-800 px-3 py-2 rounded-lg text-slate-300">
            {ticket.type}
          </span>

        </div>

        <div className="flex gap-3 mb-7">

          <button
            onClick={() => onEdit(ticket)}
            className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={() => onDelete(ticket._id)}
            className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg"
          >
            <Trash2 size={16} />
            Delete
          </button>

        </div>

        <TicketComments ticketId={ticket._id} />

      </div>

    </div>
  );
};

export default TicketDetailsModal;
