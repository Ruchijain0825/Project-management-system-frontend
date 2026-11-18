
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  FolderKanban,
  Ticket,
  Users,
  Settings,
  Search,
  Bell,
  Plus,
  CheckCircle2,
  Clock3,
  LogOut,
  Menu,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";
import KanbanBoard from "../components/KanbanBoard";
import CreateTicketModal from "../components/CreateTicketModal";
import EditTicketModal from "../components/EditTicketModal";
import TicketDetailsModal from "../components/TicketDetailsModal";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Projects", icon: FolderKanban },
  { name: "Tickets", icon: Ticket },
  { name: "Team", icon: Users },
  { name: "Settings", icon: Settings },
];

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getId = (item) => item?._id || item?.id;

const getProjectName = (project) =>
  project?.title || project?.name || "Untitled Project";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useMemo(() => getStoredUser(), []);

  const [activeNav, setActiveNav] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [tickets, setTickets] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      setError("");

      const { data } = await api.get("/projects");

      const projectList = Array.isArray(data.projects)
        ? data.projects
        : Array.isArray(data.data?.projects)
          ? data.data.projects
          : Array.isArray(data.data)
            ? data.data
            : [];

      setProjects(projectList);

      setSelectedProjectId((currentId) => {
        const stillExists = projectList.some(
          (project) => String(getId(project)) === String(currentId)
        );

        if (stillExists) return currentId;

        return projectList.length ? String(getId(projectList[0])) : "";
      });
    } catch (err) {
      console.error("Fetch projects error:", err);
      setError(
        err.response?.data?.message || "Unable to load projects"
      );
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Fetch tickets for selected project
  const fetchTickets = useCallback(async () => {
    if (!selectedProjectId) {
      setTickets([]);
      return;
    }

    try {
      setLoadingTickets(true);
      setError("");

      const { data } = await api.get(
        `/tickets/project/${selectedProjectId}`
      );

      const ticketList = Array.isArray(data.tickets)
        ? data.tickets
        : Array.isArray(data.data?.tickets)
          ? data.data.tickets
          : Array.isArray(data.data)
            ? data.data
            : [];

      setTickets(ticketList);
    } catch (err) {
      console.error("Fetch tickets error:", err);
      setError(
        err.response?.data?.message || "Unable to load tickets"
      );
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Refresh tickets after create/edit/delete
  const refreshTickets = async () => {
    await fetchTickets();
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
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
        previous.filter((ticket) => String(ticket._id) !== String(ticketId))
      );

      setSelectedTicket(null);
    } catch (err) {
      console.error("Delete ticket error:", err);
      alert(
        err.response?.data?.message || "Unable to delete ticket"
      );
    }
  };

  // Statistics from real tickets
  const stats = useMemo(() => {
    const total = tickets.length;
    const completed = tickets.filter(
      (ticket) => ticket.status === "Done"
    ).length;
    const inProgress = tickets.filter(
      (ticket) => ticket.status === "In Progress"
    ).length;
    const pending = tickets.filter(
      (ticket) => ticket.status === "To Do"
    ).length;

    return [
      {
        title: "Total Projects",
        value: projects.length,
        icon: FolderKanban,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
      },
      {
        title: "Total Tickets",
        value: total,
        icon: Ticket,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
      },
      {
        title: "Completed Tickets",
        value: completed,
        icon: CheckCircle2,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        title: "In Progress",
        value: inProgress,
        icon: Clock3,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
      },
    ];
  }, [projects, tickets]);

  const filteredProjects = projects.filter((project) =>
    getProjectName(project)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectedProject = projects.find(
    (project) => String(getId(project)) === String(selectedProjectId)
  );

  const completionPercentage = tickets.length
    ? Math.round(
        (tickets.filter((ticket) => ticket.status === "Done").length /
          tickets.length) *
          100
      )
    : 0;

  const displayName = user?.name || user?.username || "User";
  const initials = displayName.charAt(0).toUpperCase();

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`flex h-full w-[250px] shrink-0 flex-col border-r border-slate-800 bg-[#070E24] ${
        mobile ? "min-h-screen" : "sticky top-0 h-screen"
      }`}
    >
      <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-800 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400 text-black">
            <Zap size={22} />
          </div>

          <span className="text-2xl font-extrabold text-white">
            Task<span className="text-yellow-400">Flow</span>
          </span>
        </div>

        {mobile && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="px-4 pt-8">
        <p className="mb-4 px-3 text-[10px] font-bold tracking-[2px] text-slate-500">
          WORKSPACE
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveNav(item.name);
                  if (mobile) setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm ${
                  active
                    ? "border-l-[3px] border-blue-400 bg-[#182747] font-semibold text-blue-400"
                    : "border-l-[3px] border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 px-1 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {displayName}
            </p>
            <p className="text-xs capitalize text-slate-500">
              {user?.role || "Team Member"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-400 hover:bg-red-400/10"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#080D1C] font-sans text-white">
      <div className="flex min-h-screen w-full">
        {/* Desktop sidebar */}
        <div className="hidden w-[250px] shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              className="absolute inset-0 bg-black/70"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation"
            />

            <div className="relative z-10 h-full w-[250px] max-w-[85vw]">
              <Sidebar mobile />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-20 flex min-h-[76px] flex-col justify-between gap-4 border-b border-slate-800 bg-[#0B1223]/95 px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-xl font-bold text-white sm:text-2xl">
                  Welcome Back, {displayName}!
                </h1>

                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Here's a quick overview of your workspace.
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <div className="relative min-w-0 flex-1 sm:flex-none">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="h-10 w-full rounded-lg border border-slate-700 bg-[#131E37] pl-10 pr-3 text-xs text-white outline-none focus:border-blue-400 sm:w-52"
                />
              </div>

              <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800">
                <Bell size={19} />
              </button>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-purple-400 bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold">
                {initials}
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                disabled={!selectedProjectId}
                className="hidden shrink-0 items-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-xs font-bold text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50 xl:flex"
              >
                <Plus size={17} />
                Create Ticket
              </button>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-7">
            {/* Error message */}
            {error && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} />
                  {error}
                </div>

                <button
                  onClick={() => {
                    fetchProjects();
                    fetchTickets();
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={15} />
                  Retry
                </button>
              </div>
            )}

            {/* Overview */}
            {activeNav === "Overview" && (
              <>
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.title}
                        className="rounded-xl border border-slate-700/70 bg-gradient-to-br from-[#142343] to-[#10172D] p-5"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}
                        >
                          <Icon size={21} />
                        </div>

                        <p className="mt-5 text-xs text-slate-400">
                          {stat.title}
                        </p>

                        <h2 className="mt-1 text-3xl font-bold text-white">
                          {stat.value}
                        </h2>
                      </div>
                    );
                  })}
                </section>

                {/* Project selector */}
                <section className="rounded-xl border border-slate-800 bg-[#101A32] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Select Project
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Choose a project to view its tickets
                      </p>
                    </div>

                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="max-w-full rounded-lg border border-slate-700 bg-[#0B1428] px-4 py-3 text-sm text-white outline-none"
                    >
                      <option value="">Select a project</option>

                      {projects.map((project) => (
                        <option
                          key={getId(project)}
                          value={getId(project)}
                        >
                          {getProjectName(project)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {loadingProjects ? (
                    <p className="py-8 text-center text-sm text-slate-400">
                      Loading projects...
                    </p>
                  ) : projects.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">
                      No projects found. Create a project first.
                    </p>
                  ) : (
                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {filteredProjects.map((project) => {
                        const isSelected =
                          String(getId(project)) === String(selectedProjectId);

                        return (
                          <button
                            key={getId(project)}
                            onClick={() =>
                              setSelectedProjectId(String(getId(project)))
                            }
                            className={`rounded-xl border p-4 text-left transition ${
                              isSelected
                                ? "border-yellow-400 bg-yellow-400/5"
                                : "border-slate-700 bg-[#0B1428] hover:border-blue-400/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
                                <FolderKanban size={19} />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                  {getProjectName(project)}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {project.teamMembers?.length || 0} team members
                                </p>
                              </div>
                            </div>

                            {project.description && (
                              <p className="mt-3 line-clamp-2 text-xs text-slate-400">
                                {project.description}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* Ticket summary */}
                <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-[#101A32] p-5">
                    <h3 className="text-sm font-bold text-white">
                      Ticket Progress
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Completion in selected project
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-4xl font-bold text-white">
                        {completionPercentage}%
                      </span>
                      <span className="text-xs text-slate-400">
                        {tickets.filter((t) => t.status === "Done").length} of{" "}
                        {tickets.length} completed
                      </span>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#101A32] p-5">
                    <h3 className="text-sm font-bold text-white">
                      Ticket Status
                    </h3>

                    <div className="mt-5 space-y-4">
                      {[
                        {
                          name: "To Do",
                          count: tickets.filter((t) => t.status === "To Do").length,
                          color: "bg-blue-400",
                        },
                        {
                          name: "In Progress",
                          count: tickets.filter((t) => t.status === "In Progress").length,
                          color: "bg-yellow-400",
                        },
                        {
                          name: "Done",
                          count: tickets.filter((t) => t.status === "Done").length,
                          color: "bg-emerald-400",
                        },
                      ].map((item) => (
                        <div key={item.name}>
                          <div className="mb-2 flex justify-between text-xs">
                            <span className="text-slate-300">{item.name}</span>
                            <span className="text-slate-400">{item.count}</span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                            <div
                              className={`h-full rounded-full ${item.color}`}
                              style={{
                                width: `${
                                  tickets.length
                                    ? (item.count / tickets.length) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Projects page */}
            {activeNav === "Projects" && (
              <section className="rounded-xl border border-slate-800 bg-[#101A32] p-5">
                <h2 className="text-lg font-bold text-white">My Projects</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Select a project to open its tickets
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <button
                      key={getId(project)}
                      onClick={() => {
                        setSelectedProjectId(String(getId(project)));
                        setActiveNav("Tickets");
                      }}
                      className="rounded-xl border border-slate-700 bg-[#0B1428] p-5 text-left hover:border-yellow-400/50"
                    >
                      <FolderKanban className="text-blue-400" size={22} />

                      <h3 className="mt-4 font-semibold text-white">
                        {getProjectName(project)}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                        {project.description || "No project description"}
                      </p>

                      <p className="mt-4 text-xs text-yellow-400">
                        Open project →
                      </p>
                    </button>
                  ))}
                </div>

                {!loadingProjects && filteredProjects.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No projects found.
                  </p>
                )}
              </section>
            )}

            {/* Tickets page */}
            {activeNav === "Tickets" && (
              <section className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Project Tickets
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedProject
                        ? getProjectName(selectedProject)
                        : "Select a project"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-[#101A32] px-3 py-2 text-sm text-white"
                    >
                      <option value="">Select project</option>
                      {projects.map((project) => (
                        <option key={getId(project)} value={getId(project)}>
                          {getProjectName(project)}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setShowCreateModal(true)}
                      disabled={!selectedProjectId}
                      className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
                    >
                      <Plus size={17} />
                      Create Ticket
                    </button>
                  </div>
                </div>

                {loadingTickets ? (
                  <div className="rounded-xl border border-slate-800 bg-[#101A32] py-16 text-center text-sm text-slate-400">
                    Loading tickets...
                  </div>
                ) : !selectedProjectId ? (
                  <div className="rounded-xl border border-slate-800 bg-[#101A32] py-16 text-center text-sm text-slate-400">
                    Select a project to view tickets.
                  </div>
                ) : (
                  <KanbanBoard
                    tickets={tickets}
                    setTickets={setTickets}
                    onTicketClick={setSelectedTicket}
                  />
                )}
              </section>
            )}

            {/* Other navigation sections */}
            {["Team", "Settings"].includes(activeNav) && (
              <section className="rounded-xl border border-slate-800 bg-[#101A32] p-10 text-center">
                <Settings className="mx-auto text-slate-500" size={32} />

                <h2 className="mt-4 text-lg font-bold text-white">
                  {activeNav}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  This section is not connected yet.
                </p>
              </section>
            )}

            <footer className="flex flex-col justify-between gap-2 pb-3 text-[10px] text-slate-600 sm:flex-row">
              <span>© 2026 TaskFlow. All rights reserved.</span>
              <span>Manage your work. Stay productive.</span>
            </footer>
          </div>
        </main>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && selectedProjectId && (
        <CreateTicketModal
          projectId={selectedProjectId}
          onClose={() => setShowCreateModal(false)}
          onCreated={refreshTickets}
        />
      )}

      {/* Edit Ticket Modal */}
      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onUpdated={refreshTickets}
        />
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onEdit={(ticket) => {
            setSelectedTicket(null);
            setEditingTicket(ticket);
          }}
          onDelete={handleDeleteTicket}
        />
      )}
    </div>
  );
}
