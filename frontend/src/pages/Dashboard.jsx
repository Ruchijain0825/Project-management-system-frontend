
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
  ChevronDown,
  CalendarDays,
} from "lucide-react";

import api from "../services/api";
import KanbanBoard from "../components/KanbanBoard";
import CreateTicketModal from "../components/CreateTicketModal";
import CreateProjectModal from "../components/CreateProjectModal";
import EditTicketModal from "../components/EditTicketModal";
import TicketDetailsModal from "../components/TicketDetailsModal";
import AIAnalyticsChatbot from "../components/AiAnalyticsChatbot";
import TeamMembers from
 "../components/TeamMember";
import Calendar from "../components/Calendar";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Projects", icon: FolderKanban },
  { name: "Tickets", icon: Ticket },
  { name: "Team", icon: Users },
  { name: "Calendar", icon: CalendarDays },
  { name: "Settings", icon: Settings },
];

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getId = (item) => item?._id || item?.id || "";

const getProjectName = (project) =>
  project?.title || project?.name || "Untitled Project";

const extractList = (data, key) => {
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data?.[key])) return data.data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [user] = useState(getStoredUser);

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
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const displayName =
    user?.name || user?.username || user?.fullName || "User";

  const initials = displayName.charAt(0).toUpperCase();

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      setError("");

      const { data } = await api.get("/projects");
      const projectList = extractList(data, "projects");

      setProjects(projectList);

      setSelectedProjectId((currentId) => {
        const exists = projectList.some(
          (project) => String(getId(project)) === String(currentId)
        );

        if (exists) return currentId;

        return projectList.length
          ? String(getId(projectList[0]))
          : "";
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
      setLoadingTickets(false);
      return;
    }

    try {
      setLoadingTickets(true);
      setError("");

      const { data } = await api.get(
        `/tickets/project/${selectedProjectId}`
      );

      const ticketList = extractList(data, "tickets");
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

  // Refresh project list after creating a project
  const refreshProjects = async () => {
    await fetchProjects();
    setActiveNav("Projects");
  };

  // Refresh data after ticket operations
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
        previous.filter(
          (ticket) => String(ticket._id) !== String(ticketId)
        )
      );

      setSelectedTicket(null);
    } catch (err) {
      console.error("Delete ticket error:", err);
      window.alert(
        err.response?.data?.message || "Unable to delete ticket"
      );
    }
  };

  // Search projects
  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return projects;

    return projects.filter((project) =>
      getProjectName(project).toLowerCase().includes(query)
    );
  }, [projects, search]);

  const selectedProject = projects.find(
    (project) =>
      String(getId(project)) === String(selectedProjectId)
  );

  // Real ticket statistics
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

  const completionPercentage = totalTickets
    ? Math.round((completedTickets / totalTickets) * 100)
    : 0;

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Tickets",
      value: totalTickets,
      icon: Ticket,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Completed Tickets",
      value: completedTickets,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "In Progress",
      value: inProgressTickets,
      icon: Clock3,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
  ];

  // Sidebar
  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`flex h-full w-[250px] shrink-0 flex-col border-r border-slate-800 bg-[#070E24] ${
        mobile ? "min-h-screen" : "sticky top-0 h-screen"
      }`}
    >
      <div className="flex h-[76px] items-center justify-between border-b border-slate-800 px-6">
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
            aria-label="Close menu"
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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#080D1C] text-white">
      <div className="flex min-h-screen">

        {/* Desktop Sidebar */}
        <div className="hidden w-[250px] shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
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
                className="rounded-lg border border-slate-700 p-2 text-slate-300 lg:hidden"
                aria-label="Open navigation"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-xl font-bold text-white sm:text-2xl">
                  Welcome Back, {displayName}!
                </h1>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Manage your projects and track your work.
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

              <button
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800"
                aria-label="Notifications"
              >
                <Bell size={19} />
              </button>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-purple-400 bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold">
                {initials}
              </div>

              <button
                onClick={fetchProjects}
                disabled={loadingProjects}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-yellow-400 px-3 py-3 text-xs font-bold text-black hover:bg-yellow-300 disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={loadingProjects ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-7">

            {/* Error */}
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
                          {loadingProjects || loadingTickets
                            ? "..."
                            : stat.value}
                        </h2>
                      </div>
                    );
                  })}
                </section>

                <section className="rounded-xl border border-slate-800 bg-[#101A32] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Project Overview
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Select a project to view its tickets
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveNav("Projects")}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      View Projects →
                    </button>
                  </div>

                  {loadingProjects ? (
                    <p className="py-10 text-center text-sm text-slate-400">
                      Loading projects...
                    </p>
                  ) : filteredProjects.length === 0 ? (
                    <div className="py-12 text-center">
                      <FolderKanban
                        size={42}
                        className="mx-auto text-slate-600"
                      />
                      <h3 className="mt-4 font-semibold text-white">
                        {search ? "No matching projects" : "No projects yet"}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500">
                        {search
                          ? "Try another search."
                          : "Your projects will appear here when available."}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {filteredProjects.slice(0, 6).map((project) => (
                        <button
                          key={getId(project)}
                          onClick={() => {
                            setSelectedProjectId(String(getId(project)));
                            setActiveNav("Tickets");
                          }}
                          className="rounded-xl border border-slate-700 bg-[#0B1428] p-4 text-left transition hover:border-yellow-400/50"
                        >
                          <FolderKanban
                            size={21}
                            className="text-blue-400"
                          />
                          <h4 className="mt-3 font-semibold text-white">
                            {getProjectName(project)}
                          </h4>
                          <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                            {project.description || "No description"}
                          </p>
                          <p className="mt-4 text-xs text-yellow-400">
                            Open tickets →
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

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
                        {completedTickets} of {totalTickets} completed
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
                        { name: "To Do", count: todoTickets, color: "bg-blue-400" },
                        { name: "In Progress", count: inProgressTickets, color: "bg-yellow-400" },
                        { name: "Done", count: completedTickets, color: "bg-emerald-400" },
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
                                  totalTickets
                                    ? (item.count / totalTickets) * 100
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

            {/* Projects */}
            {activeNav === "Projects" && (
              <section className="rounded-xl border border-slate-800 bg-[#101A32] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      My Projects
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Select a project to open its tickets
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-blue-500/10 px-3 py-2 text-xs text-blue-400">
                      {projects.length} Projects
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowProjectModal(true)}
                      className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-yellow-300"
                    >
                      <Plus size={17} />
                      Create Project
                    </button>
                  </div>
                </div>

                {loadingProjects ? (
                  <p className="py-10 text-center text-sm text-slate-400">
                    Loading projects...
                  </p>
                ) : filteredProjects.length === 0 ? (
                  <div className="py-14 text-center">
                    <FolderKanban
                      size={42}
                      className="mx-auto text-slate-600"
                    />
                    <h3 className="mt-4 font-semibold text-white">
                      {search ? "No matching projects" : "No projects found"}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500">
                      {search
                        ? "Try another project name."
                        : "Create a project before adding tickets."}
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProjects.map((project) => (
                      <button
                        key={getId(project)}
                        onClick={() => {
                          setSelectedProjectId(String(getId(project)));
                          setActiveNav("Tickets");
                        }}
                        className="rounded-xl border border-slate-700 bg-[#0B1428] p-5 text-left transition hover:border-yellow-400/50"
                      >
                        <FolderKanban
                          size={23}
                          className="text-blue-400"
                        />
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
                )}
              </section>
            )}

            {/* Tickets + Kanban */}
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
                        : "Select a project to view its tickets"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-[#101A32] px-3 py-2 text-sm text-white outline-none"
                    >
                      <option value="">Select project</option>
                      {projects.map((project) => (
                        <option
                          key={getId(project)}
                          value={getId(project)}
                        >
                          {getProjectName(project)}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setShowCreateModal(true)}
                      disabled={!selectedProjectId}
                      className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <div className="rounded-xl border border-slate-800 bg-[#101A32] py-16 text-center">
                    <FolderKanban
                      size={42}
                      className="mx-auto text-slate-600"
                    />
                    <h3 className="mt-4 font-semibold text-white">
                      Select a project
                    </h3>
                    <p className="mt-2 text-xs text-slate-500">
                      Choose a project to open its Kanban board.
                    </p>
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

            {/* Team Management */}
            {activeNav === "Team" && (
              <TeamMembers
                projects={projects}
                initialProjectId={selectedProjectId}
              />
            )}

            {/* Calendar */}
            {activeNav === "Calendar" && (
              <Calendar
                tickets={tickets}
                onTicketClick={setSelectedTicket}
              />
            )}

            {/* Settings */}
            {activeNav === "Settings" && (
              <section className="rounded-xl border border-slate-800 bg-[#101A32] p-10 text-center">
                <Settings
                  className="mx-auto text-slate-500"
                  size={32}
                />
                <h2 className="mt-4 text-lg font-bold text-white">
                  Settings
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Settings section is not connected yet.
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

      {/* Create Project Modal */}
      {showProjectModal && (
        <CreateProjectModal
          onClose={() => setShowProjectModal(false)}
          onCreated={refreshProjects}
        />
      )}

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

      {/* AI Analytics Chatbot - available across Dashboard sections */}
      <AIAnalyticsChatbot projectId={selectedProjectId} />
    </div>
  );
}
