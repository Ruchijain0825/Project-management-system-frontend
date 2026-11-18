
import { useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Search, RotateCcw } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColoumn";
import api from "../services/api";

const STATUSES = ["To Do", "In Progress", "Done"];

const getTicketId = (ticket) =>
  String(ticket?._id || ticket?.id || "");

const KanbanBoard = ({
  tickets = [],
  setTickets,
  onTicketClick,
}) => {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const safeTickets = Array.isArray(tickets) ? tickets : [];

  const filteredTickets = useMemo(() => {
    let result = safeTickets.filter(
      (ticket) => ticket && getTicketId(ticket)
    );

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((ticket) =>
        String(ticket.title || "").toLowerCase().includes(query) ||
        String(ticket.description || "").toLowerCase().includes(query)
      );
    }

    if (priority !== "All") {
      result = result.filter(
        (ticket) => ticket.priority === priority
      );
    }

    if (status !== "All") {
      result = result.filter(
        (ticket) => ticket.status === status
      );
    }

    result = [...result];

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0);
      }

      if (sortBy === "title") {
        return String(a.title || "").localeCompare(
          String(b.title || "")
        );
      }

      if (sortBy === "priority") {
        const order = {
          Critical: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };

        return (order[b.priority] || 0) -
          (order[a.priority] || 0);
      }

      return 0;
    });

    return result;
  }, [safeTickets, search, priority, status, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setPriority("All");
    setStatus("All");
    setSortBy("newest");
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || !setTickets) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const ticket = safeTickets.find(
      (item) => getTicketId(item) === draggableId
    );

    if (!ticket) return;

    const newStatus = destination.droppableId;

    if (!STATUSES.includes(newStatus)) return;
    if (ticket.status === newStatus) return;

    const previousTickets = [...safeTickets];

    const updatedTickets = safeTickets.map((item) =>
      getTicketId(item) === draggableId
        ? { ...item, status: newStatus }
        : item
    );

    setTickets(updatedTickets);

    try {
      await api.put(`/tickets/${draggableId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Ticket status update failed:", error);
      setTickets(previousTickets);

      alert(
        error.response?.data?.message ||
        "Could not update ticket status"
      );
    }
  };

  return (
    <div className="space-y-5">

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2.5 pl-10 pr-4 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-white"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-white"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="priority">Priority</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2.5 text-gray-300 hover:bg-gray-700"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Showing {filteredTickets.length} of {safeTickets.length} tickets
        </p>
      </div>

      {safeTickets.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 py-12 text-center text-gray-400">
          No tickets created yet. Click Create Ticket to get started.
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STATUSES
              .filter((item) => status === "All" || status === item)
              .map((columnStatus) => {
                const columnTickets = filteredTickets.filter(
                  (ticket) => ticket.status === columnStatus
                );

                return (
                  <KanbanColumn
                    key={columnStatus}
                    status={columnStatus}
                    tickets={columnTickets}
                    onTicketClick={onTicketClick}
                  />
                );
              })}
          </div>
        </DragDropContext>
      )}

      {safeTickets.length > 0 && filteredTickets.length === 0 && (
        <p className="py-4 text-center text-gray-400">
          No tickets match your search or filters.
        </p>
      )}
    </div>
  );
};

export default KanbanBoard;
