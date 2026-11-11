
import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Search, Filter } from "lucide-react";

import KanbanColumn from "./KanbanColumn";
import api from "../services/api";

const STATUSES = ["To Do", "In Progress", "Done"];

const KanbanBoard = ({ tickets, setTickets }) => {

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("All");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Search and filter
  const filteredTickets = tickets.filter((ticket) => {

    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(search.toLowerCase());

    const matchesPriority =
      priority === "All" || ticket.priority === priority;

    return matchesSearch && matchesPriority;
  });

  // Group tickets by status
  const getTicketsByStatus = (status) => {
    return filteredTickets.filter(
      ticket => ticket.status === status
    );
  };

  // Drag and Drop Handler
  const handleDragEnd = async (result) => {

    const { destination, source, draggableId } = result;

    setError("");

    // Dropped outside the board
    if (!destination) return;

    // Same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Same column: no status change
    if (destination.droppableId === source.droppableId) {
      return;
    }

    const newStatus = destination.droppableId;

    if (!STATUSES.includes(newStatus)) return;

    const ticket = tickets.find(
      item => item._id === draggableId
    );

    if (!ticket) return;

    const oldStatus = ticket.status;

    // Optimistic UI update
    setTickets(previous =>
      previous.map(item =>
        item._id === draggableId
          ? { ...item, status: newStatus }
          : item
      )
    );

    setUpdating(true);

    try {
      await api.put(`/tickets/${draggableId}`, {
        status: newStatus
      });

    } catch (err) {

      // Rollback if API fails
      setTickets(previous =>
        previous.map(item =>
          item._id === draggableId
            ? { ...item, status: oldStatus }
            : item
        )
      );

      setError(
        err.response?.data?.message ||
        "Unable to update ticket status"
      );

    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Search and Filters */}

      <div className="flex flex-col md:flex-row gap-4 justify-between">

        <div className="relative flex-1 max-w-md">

          <Search
            className="absolute left-3 top-3 text-slate-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-yellow-400"
          />

        </div>

        <div className="flex items-center gap-2">

          <Filter size={20} className="text-slate-400" />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

        </div>

      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {updating && (
        <p className="text-yellow-400 text-sm">
          Updating ticket status...
        </p>
      )}

      {/* Kanban Columns */}

      <DragDropContext onDragEnd={handleDragEnd}>

        <div className="flex gap-5 overflow-x-auto pb-5">

          <KanbanColumn
            title="To Do"
            tickets={getTicketsByStatus("To Do")}
            color="bg-slate-400"
          />

          <KanbanColumn
            title="In Progress"
            tickets={getTicketsByStatus("In Progress")}
            color="bg-blue-400"
          />

          <KanbanColumn
            title="Done"
            tickets={getTicketsByStatus("Done")}
            color="bg-green-400"
          />

        </div>

      </DragDropContext>

      <p className="text-xs text-slate-500">
        Showing {filteredTickets.length} of {tickets.length} tickets
      </p>

    </div>
  );
};

export default KanbanBoard;
