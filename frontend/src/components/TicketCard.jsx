
import { GripVertical, MessageSquare, Pencil, Trash2 } from "lucide-react";

function TicketCard({
  ticket,
  onClick,
  onEdit,
  onDelete,
  dragAttributes,
  dragListeners,
}) {
  const priorityStyles = {
    Low: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    Medium: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    High: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  };

  const priority = ticket.priority || "Medium";

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-slate-700/80 bg-slate-950 p-4 transition hover:-translate-y-0.5 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-950/30"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <button
            type="button"
            {...dragAttributes}
            {...dragListeners}
            onClick={(e) => e.stopPropagation()}
            aria-label="Drag ticket"
            className="mt-0.5 cursor-grab touch-none rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-sky-400 active:cursor-grabbing"
          >
            <GripVertical size={17} />
          </button>

          <h4 className="break-words text-sm font-semibold text-slate-100">
            {ticket.title || "Untitled ticket"}
          </h4>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-300"
              aria-label="Edit ticket"
            >
              <Pencil size={14} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
              aria-label="Delete ticket"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {ticket.description && (
        <p className="mb-4 line-clamp-2 text-xs leading-5 text-slate-400">
          {ticket.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${
            priorityStyles[priority] || priorityStyles.Medium
          }`}
        >
          {priority}
        </span>

        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MessageSquare size={13} />
          <span>{ticket.comments?.length || 0}</span>
        </div>
      </div>
    </article>
  );
}

export default TicketCard;
