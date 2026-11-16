
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Ticket,
  Clock,
  CheckCircle,
  Plus,
  Users,
  AlertCircle,
} from "lucide-react";
import { Sparkles } from "lucide-react";
import AITicketGenerator from "../components/AITicketGenerator";
import { Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import TicketCard from "../components/TicketCard";
import CreateTicketModal from "../components/CreateTicketModal";
import KanbanBoard from "../components/KanbanBoard";
import TicketDetailsModal from "../components/TicketDetailsModal";
import EditTicketModal from "../components/EditTicketModal";

import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  // Navigation
  const [active, setActive] = useState("Overview");

  // Project states
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  // Ticket states
  const [tickets, setTickets] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/projects");

      const projectList = response.data.projects || [];

      setProjects(projectList);

      if (projectList.length > 0) {
        setSelectedProject((previous) => {
          const exists = projectList.some(
            (project) => project._id === previous
          );

          return exists ? previous : projectList[0]._id;
        });
      } else {
        setSelectedProject("");
        setTickets([]);
      }
    } catch (error) {
      console.error("Fetch projects error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch projects"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    if (!selectedProject) {
      setTickets([]);
      return;
    }

    try {
      setTicketLoading(true);
      setError("");

      const response = await api.get(
        `/tickets/project/${selectedProject}`
      );

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error("Fetch tickets error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch tickets"
      );
    } finally {
      setTicketLoading(false);
    }
  }, [selectedProject]);

  // Initial projects load
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Project change -> fetch tickets
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Refresh after ticket creation
  const handleTicketCreated = async () => {
    await fetchTickets();
    setShowModal(false);
  };

  // Open ticket details
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  // Open edit modal
  const handleEditTicket = (ticket) => {
    setSelectedTicket(null);
    setEditingTicket(ticket);
  };

  // After update
  const handleTicketUpdated = async () => {
    await fetchTickets();

    setEditingTicket(null);
    setSelectedTicket(null);
  };

  // Delete ticket
  const handleDeleteTicket = async (ticketId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tickets/${ticketId}`);

      setTickets((previous) =>
        previous.filter(
          (ticket) => ticket._id !== ticketId
        )
      );

      setSelectedTicket(null);
      setEditingTicket(null);
    } catch (error) {
      console.error("Delete ticket error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete ticket"
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // Dashboard statistics
  const totalTickets = tickets.length;

  const todoTickets = tickets.filter(
    (ticket) => ticket.status === "To Do"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const completedTickets = tickets.filter(
    (ticket) => ticket.status === "Done"
  ).length;

  const highPriorityTickets = tickets.filter(
    (ticket) =>
      ticket.priority === "High" ||
      ticket.priority === "Critical"
  ).length;

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">

      {/* SIDEBAR */}
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0">

        {/* HEADER */}
        <Header
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          onCreateTicket={() => setShowModal(true)}
        />

        <div className="p-4 md:p-6 lg:p-8">

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* NO PROJECTS */}
          {projects.length === 0 ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">

              <FolderKanban
                size={55}
                className="text-yellow-400 mb-4"
              />

              <h2 className="text-2xl font-semibold mb-2">
                No projects yet
              </h2>

              <p className="text-gray-400 mb-5">
                Create your first project to start managing tickets.
              </p>

              <button
                onClick={() => setActive("Projects")}
                className="bg-yellow-400 text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-300"
              >
                Go to Projects
              </button>

            </div>
          ) : (
            <>

              {/* OVERVIEW */}
              {active === "Overview" && (
                <div className="space-y-7">

                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      Dashboard Overview
                    </h1>

                    <p className="text-gray-400 mt-2">
                      Track your project progress and team activity.
                    </p>
                  </div>

                  {/* STATISTICS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                    <StatCard
                      title="Total Tickets"
                      value={totalTickets}
                      icon={<Ticket size={22} />}
                    />

                    <StatCard
                      title="To Do"
                      value={todoTickets}
                      icon={<Clock size={22} />}
                    />

                    <StatCard
                      title="In Progress"
                      value={inProgressTickets}
                      icon={<FolderKanban size={22} />}
                    />

                    <StatCard
                      title="Completed"
                      value={completedTickets}
                      icon={<CheckCircle size={22} />}
                    />

                  </div>

                  {/* HIGH PRIORITY */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-gray-400 text-sm">
                          High / Critical Priority
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                          {highPriorityTickets}
                        </h2>
                      </div>

                      <AlertCircle
                        size={30}
                        className="text-red-400"
                      />

                    </div>

                  </div>

                  {/* RECENT TICKETS */}
                  <section>

                    <div className="flex items-center justify-between mb-4">

                      <h2 className="text-xl font-semibold">
                        Recent Tickets
                      </h2>

                      <button
                        onClick={() => setActive("Tickets")}
                        className="text-yellow-400 text-sm hover:underline"
                      >
                        View all
                      </button>

                    </div>

                    {ticketLoading ? (
                      <p className="text-gray-400">
                        Loading tickets...
                      </p>
                    ) : tickets.length === 0 ? (
                      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">

                        <Ticket
                          size={35}
                          className="mx-auto text-gray-500 mb-3"
                        />

                        <p className="text-gray-400">
                          No tickets created yet.
                        </p>

                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {[...tickets]
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt || 0) -
                              new Date(a.createdAt || 0)
                          )
                          .slice(0, 4)
                          .map((ticket) => (
                            <TicketCard
                              key={ticket._id}
                              ticket={ticket}
                              onClick={() =>
                                handleTicketClick(ticket)
                              }
                            />
                          ))}

                      </div>
                    )}

                  </section>

                  {/* QUICK ACTIONS */}
                  <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">

                    <h2 className="text-lg font-semibold mb-4">
                      Quick Actions
                    </h2>

                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2.5 rounded-lg font-semibold hover:bg-yellow-300"
                    >
                      <Plus size={18} />
                      Create New Ticket
                    </button>
                    <button
                        onClick={() => setShowAIModal(true)}
                        className="flex items-center gap-2 mt-3 bg-purple-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-purple-400"
                    >
                    <Sparkles size={18} />
                    Generate Ticket with AI
                    </button>

                  </section>

                </div>
              )}

              {/* PROJECTS */}
              {active === "Projects" && (
                <section>

                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

                    <div>
                      <h1 className="text-2xl font-bold">
                        Projects
                      </h1>

                      <p className="text-gray-400 mt-1">
                        Manage your projects.
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/projects")}
                      className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold"
                    >
                      <Plus size={18} />
                      Manage Projects
                    </button>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                    {projects.map((project) => (
                      <div
                        key={project._id}
                        onClick={() =>
                          setSelectedProject(project._id)
                        }
                        className={`bg-gray-900 border rounded-xl p-5 cursor-pointer transition ${
                          selectedProject === project._id
                            ? "border-yellow-400"
                            : "border-gray-800 hover:border-gray-600"
                        }`}
                      >

                        <div className="flex items-center justify-between mb-4">

                          <FolderKanban
                            size={25}
                            className="text-yellow-400"
                          />

                          <span className="text-xs text-gray-400">
                            {project.teamMembers?.length || 0} members
                          </span>

                        </div>

                        <h3 className="font-semibold text-lg">
                          {project.title}
                        </h3>

                        <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                          {project.description ||
                            "No description available"}
                        </p>

                        <p className="text-xs text-yellow-400 mt-4">
                          {selectedProject === project._id
                            ? "Selected project"
                            : "Click to select"}
                        </p>

                      </div>
                    ))}

                  </div>

                </section>
              )}

              {/* TICKETS - SEARCH FILTER SORT KANBAN */}
              {active === "Tickets" && (
                <section>

                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

                    <div>
                      <h1 className="text-2xl font-bold">
                        Ticket Board
                      </h1>

                      <p className="text-gray-400 mt-1">
                        Search, filter, sort and manage your tickets.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300"
                    >
                      <Plus size={18} />
                      Create Ticket
                    </button>

                  </div>

                  {ticketLoading ? (
                    <div className="text-gray-400 py-8">
                      Loading tickets...
                    </div>
                  ) : (
                    <KanbanBoard
                      tickets={tickets}
                      setTickets={setTickets}
                      onTicketClick={handleTicketClick}
                    />
                  )}

                </section>
              )}

              {/* TEAM */}
              {active === "Team" && (
                <section>

                  <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                      Team Members
                    </h1>

                    <p className="text-gray-400 mt-1">
                      People working on this project.
                    </p>
                  </div>

                  {(() => {
                    const currentProject = projects.find(
                      (project) =>
                        project._id === selectedProject
                    );

                    const members = currentProject
                      ? [
                          ...(currentProject.owner
                            ? [currentProject.owner]
                            : []),
                          ...(currentProject.teamMembers || []),
                        ]
                      : [];

                    const uniqueMembers = [
                      ...new Map(
                        members
                          .filter(Boolean)
                          .map((member) => [
                            member._id,
                            member,
                          ])
                      ).values(),
                    ];

                    return uniqueMembers.length === 0 ? (
                      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">

                        <Users
                          size={35}
                          className="mx-auto text-gray-500 mb-3"
                        />

                        <p className="text-gray-400">
                          No team members found.
                        </p>

                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

                        {uniqueMembers.map((member) => (
                          <div
                            key={member._id}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
                          >

                            <div className="w-12 h-12 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-lg mb-3">
                              {member.name
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                            </div>

                            <h3 className="font-semibold">
                              {member.name || "Unknown User"}
                            </h3>

                            <p className="text-sm text-gray-400 mt-1">
                              {member.email}
                            </p>

                            <span className="inline-block mt-3 text-xs bg-gray-800 px-3 py-1 rounded-full text-yellow-400 capitalize">
                              {member.role || "Developer"}
                            </span>

                          </div>
                        ))}

                      </div>
                    );
                  })()}

                </section>
              )}

            </>
          )}

        </div>
      </main>

      {/* CREATE TICKET MODAL */}
      {showModal && (
        <CreateTicketModal
          projectId={selectedProject}
          onClose={() => setShowModal(false)}
          onCreated={handleTicketCreated}
        />
      )}

      {/* TICKET DETAILS MODAL */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onEdit={handleEditTicket}
          onDelete={handleDeleteTicket}
        />
      )}

      {/* EDIT TICKET MODAL */}
      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onUpdated={handleTicketUpdated}
        />
      )}

      {showAIModal && (
       <AITicketGenerator
       projectId={selectedProject}
       onClose={() => setShowAIModal(false)}
       onCreated={fetchTickets}
  />
)}

    </div>
  );
};

export default Dashboard;
