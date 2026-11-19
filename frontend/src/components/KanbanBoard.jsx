
import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Search } from "lucide-react";
import api from "../services/api";
import KanbanColumn from "./KanbanColoumn";

const STATUSES = ["To Do", "In Progress", "Done"];

const getId = (ticket) => String(ticket._id || ticket.id);

function KanbanBoard({
  tickets = [],
  setTickets,
  onTicketClick,
  onEditTicket,
  onDeleteTicket,
}) {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const visibleTickets = tickets.filter((ticket) => {
    const query = search.toLowerCase();
    return (
      (ticket.title || "").toLowerCase().includes(query) ||
      (ticket.description || "").toLowerCase().includes(query)
    );
  });

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setError("");

    const activeTicket = tickets.find(
      (ticket) => getId(ticket) === String(active.id)
    );

    if (!activeTicket) return;

    const overTicket = tickets.find(
      (ticket) => getId(ticket) === String(over.id)
    );

    const sourceStatus = activeTicket.status;
    const destinationStatus = overTicket
      ? overTicket.status
      : String(over.id);

    if (!STATUSES.includes(destinationStatus)) return;

    const previousTickets = [...tickets];

    // Moving between columns
    if (sourceStatus !== destinationStatus) {
      const updatedTickets = tickets.map((ticket) =>
        getId(ticket) === String(active.id)
          ? { ...ticket, status: destinationStatus }
          : ticket
      );

      setTickets(updatedTickets);

      try {
        await api.put(`/tickets/${active.id}`, {
          status: destinationStatus,
        });
      } catch (err) {
        setTickets(previousTickets);
        setError(
          err.response?.data?.message || "Unable to update ticket status."
        );
      }

      return;
    }

    // Reordering inside the same column
    if (!overTicket || overTicket.status !== sourceStatus) return;

    const columnTickets = tickets.filter(
      (ticket) => ticket.status === sourceStatus
    );

    const oldIndex = columnTickets.findIndex(
      (ticket) => getId(ticket) === String(active.id)
    );

    const newIndex = columnTickets.findIndex(
      (ticket) => getId(ticket) === String(over.id)
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedColumn = arrayMove(columnTickets, oldIndex, newIndex);
    let position = 0;

    const reorderedTickets = tickets.map((ticket) => {
      if (ticket.status !== sourceStatus) return ticket;
      return reorderedColumn[position++];
    });

    setTickets(reorderedTickets);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Kanban Board</h2>
          <p className="mt-1 text-sm text-slate-400">
            Drag and drop tickets to update their progress.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-indigo-500"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tickets={visibleTickets.filter(
                (ticket) => ticket.status === status
              )}
              onTicketClick={onTicketClick}
              onEditTicket={onEditTicket}
              onDeleteTicket={onDeleteTicket}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
