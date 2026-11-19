
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import TicketCard from "./TicketCard";

const columnStyles = {
  "To Do": {
    icon: Circle,
    color: "text-sky-400",
    border: "border-sky-400/20",
    background: "bg-sky-400/5",
  },
  "In Progress": {
    icon: Clock3,
    color: "text-indigo-400",
    border: "border-indigo-400/20",
    background: "bg-indigo-400/5",
  },
  Done: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    border: "border-emerald-400/20",
    background: "bg-emerald-400/5",
  },
};

function SortableTicket({
  ticket,
  onTicketClick,
  onEditTicket,
  onDeleteTicket,
}) {
  const id = String(ticket._id || ticket.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TicketCard
        ticket={ticket}
        onClick={() => onTicketClick?.(ticket)}
        onEdit={() => onEditTicket?.(ticket)}
        onDelete={() => onDeleteTicket?.(ticket)}
        dragAttributes={attributes}
        dragListeners={listeners}
      />
    </div>
  );
}

function KanbanColumn({
  status,
  tickets = [],
  onTicketClick,
  onEditTicket,
  onDeleteTicket,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const style = columnStyles[status];
  const Icon = style.icon;

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[420px] rounded-2xl border p-4 transition ${
        isOver
          ? "border-indigo-400 bg-indigo-500/10"
          : "border-slate-800 bg-slate-900/60"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={18} className={style.color} />
          <h3 className="font-semibold text-white">{status}</h3>
        </div>

        <span
          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${style.color} ${style.border} ${style.background}`}
        >
          {tickets.length}
        </span>
      </div>

      <SortableContext
        items={tickets.map((ticket) =>
          String(ticket._id || ticket.id)
        )}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-[340px] space-y-3">
          {tickets.map((ticket) => (
            <SortableTicket
              key={String(ticket._id || ticket.id)}
              ticket={ticket}
              onTicketClick={onTicketClick}
              onEditTicket={onEditTicket}
              onDeleteTicket={onDeleteTicket}
            />
          ))}

          {tickets.length === 0 && (
            <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
              Drop tickets here
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

export default KanbanColumn;
