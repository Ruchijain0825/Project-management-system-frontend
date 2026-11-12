
import { useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Search, RotateCcw } from "lucide-react";

import KanbanColumn from "./KanbanColumn";
import api from "../services/api";

const STATUSES = ["To Do", "In Progress", "Done"];

const KanbanBoard = ({
  tickets,
  setTickets,
  onTicketClick,
}) => {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Search + Filter + Sort
  const filteredTickets = useMemo(() => {
    let result = [...tickets];

    // Search by title and description
    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((ticket) => {
        return (
          ticket.title?.toLowerCase().includes(query) ||
          ticket.description?.toLowerCase().includes(query)
        );
      });
    }

    // Priority filter
    if (priority !== "All") {
      result = result.filter(
        (ticket) => ticket.priority === priority
      );
    }

    // Status filter
    if (status !== "All") {
      result = result.filter(
        (ticket) => ticket.status === status
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
        );
      }

      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortBy === "priority") {
        const priorityOrder = {
          Critical: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };

        return (
          (priorityOrder[b.priority] || 0) -
          (priorityOrder[a.priority] || 0)
        );
      }

      return 0;
    });

    return result;
  }, [tickets, search, priority, status, sortBy]);

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setPriority("All");
    setStatus("All");
    setSortBy("newest");
  };

  // Drag and Drop
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const ticket = tickets.find(
      (item) => item._id === draggableId
    );

    if (!ticket) return;

    const previousTickets = [...tickets];
    const newStatus = destination.droppableId;

    // Optimistic status update
    const updatedTickets = tickets.map((item) =>
      item._id === draggableId
        ? { ...item, status: newStatus }
        : item
    );

    setTickets(updatedTickets);

    // Persist changed status
    if (ticket.status !== newStatus) {
      try {
        await api.put(`/tickets/${draggableId}`, {
          status: newStatus,
        });
      } catch (error) {
        console.error("Status update failed:", error);

        setTickets(previousTickets);

        alert(
          error.response?.data?.message ||
          "Could not update ticket status"
        );
      }
    }
  };

  return (
    <div className="space-y-5">

      {/* Search and Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">

        <div className="flex flex-col lg:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white outline-none focus:border-yellow-400"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="priority">Priority</option>
          </select>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
          >
            <RotateCcw size={16} />
            Reset
          </button>

        </div>

        <p className="text-xs text-gray-400 mt-3">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </p>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">

          {STATUSES
            .filter(
              (columnStatus) =>
                status === "All" || status === columnStatus
            )
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

      {filteredTickets.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No tickets match your search or filters.
        </div>
      )}

    </div>
  );
};

export default KanbanBoard;