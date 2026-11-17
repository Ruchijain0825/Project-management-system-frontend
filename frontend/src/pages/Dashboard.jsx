
import React, { useState } from "react";
import {
  Zap,
  LayoutDashboard,
  CalendarDays,
  FolderKanban,
  Users,
  Settings,
  Search,
  Bell,
  Plus,
  CheckCircle2,
  TrendingUp,
  Ticket,
  LogOut,
  MoreHorizontal,
  Clock3,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Calendar", icon: CalendarDays },
  { name: "Projects", icon: FolderKanban },
  { name: "Tickets", icon: Ticket },
  { name: "Team", icon: Users },
  { name: "Settings", icon: Settings },
];

const stats = [
  {
    title: "Total Projects",
    value: "48",
    change: "+12.5%",
    icon: FolderKanban,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Completed Tasks",
    value: "189",
    change: "+18.2%",
    icon: CheckCircle2,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "Team Utilization",
    value: "85%",
    change: "+8.4%",
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

const chartData = [
  { month: "Jan", current: 320, previous: 280 },
  { month: "Feb", current: 450, previous: 380 },
  { month: "Mar", current: 390, previous: 520 },
  { month: "Apr", current: 550, previous: 420 },
  { month: "May", current: 430, previous: 580 },
  { month: "Jun", current: 620, previous: 490 },
  { month: "Jul", current: 500, previous: 650 },
  { month: "Aug", current: 700, previous: 570 },
  { month: "Sep", current: 590, previous: 730 },
  { month: "Oct", current: 760, previous: 650 },
  { month: "Nov", current: 680, previous: 790 },
  { month: "Dec", current: 850, previous: 720 },
];

const projects = [
  {
    id: 1,
    name: "TaskFlow Web App",
    category: "Website Development",
    status: "On Track",
    deadline: "25 Nov 2026",
    progress: 85,
    color: "bg-cyan-400",
  },
  {
    id: 2,
    name: "AI Integration",
    category: "Backend Development",
    status: "At Risk",
    deadline: "28 Nov 2026",
    progress: 55,
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    category: "Marketing",
    status: "Off Track",
    deadline: "05 Dec 2026",
    progress: 30,
    color: "bg-blue-500",
  },
  {
    id: 4,
    name: "Mobile Application",
    category: "App Development",
    status: "On Track",
    deadline: "15 Dec 2026",
    progress: 70,
    color: "bg-cyan-400",
  },
];

const activities = [
  {
    title: "Task UI Redesign",
    description: "Project task completed",
    time: "2 hours ago",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    title: "API Integration",
    description: "New comment added",
    time: "4 hours ago",
    icon: Ticket,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    title: "Mobile App",
    description: "Project created",
    time: "Yesterday",
    icon: FolderKanban,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    title: "Team Update",
    description: "New member joined",
    time: "Yesterday",
    icon: Users,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
];

const statusStyles = {
  "On Track": "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  "At Risk": "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  "Off Track": "bg-red-400/10 text-red-400 border-red-400/20",
};

function Sidebar({ activeNav, setActiveNav, mobile = false, onClose }) {
  return (
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
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Task<span className="text-yellow-400">Flow</span>
          </span>
        </div>

        {mobile && (
          <button
            onClick={onClose}
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
                  onClose?.();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                  active
                    ? "border-l-[3px] border-blue-400 bg-[#182747] font-semibold text-blue-400"
                    : "border-l-[3px] border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 px-1 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
            U
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Username
            </p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <MoreHorizontal size={19} className="text-slate-500" />
        </div>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-400 hover:bg-red-400/10">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#080D1C] font-sans text-white">
      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        <div className="hidden w-[250px] shrink-0 lg:block">
          <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
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
              <Sidebar
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                mobile
                onClose={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-20 flex min-h-[76px] flex-col justify-between gap-4 border-b border-slate-800 bg-[#0B1223]/95 px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
                aria-label="Open navigation"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Welcome Back, User!
                </h1>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Here's a quick overview of your work status.
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
                  placeholder="Type to search..."
                  className="h-10 w-full rounded-lg border border-slate-700 bg-[#131E37] pl-10 pr-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-blue-400 sm:w-52"
                />
              </div>

              <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800">
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-yellow-400" />
              </button>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-purple-400 bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold">
                U
              </div>

              <button className="hidden shrink-0 items-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-xs font-bold text-black transition-colors hover:bg-yellow-300 xl:flex">
                <Plus size={17} />
                Create Ticket
              </button>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-7">
            {/* Stats */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="relative min-w-0 overflow-hidden rounded-xl border border-slate-700/70 bg-gradient-to-br from-[#142343] to-[#10172D] p-5 transition hover:-translate-y-1 hover:border-blue-400/40"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}
                      >
                        <Icon size={21} />
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <TrendingUp size={14} />
                        {stat.change}
                      </span>
                    </div>
                    <p className="mt-5 text-xs text-slate-400">{stat.title}</p>
                    <h2 className="mt-1 text-3xl font-bold text-white">
                      {stat.value}
                    </h2>
                    <p className="mt-2 text-[10px] text-slate-500">
                      Compared to last month
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Chart and Activity */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(270px,1fr)]">
              <div className="min-w-0 rounded-xl border border-slate-800 bg-[#101A32] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Project Progress Overview
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Monthly performance analytics
                    </p>
                  </div>
                  <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0B1428] px-3 py-2 text-[10px] text-slate-400">
                    <CalendarDays size={14} />
                    This Year
                    <ChevronDown size={13} />
                  </button>
                </div>

                <div className="mt-5 mb-2 flex justify-end gap-4 text-[10px] text-slate-400">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Last Month
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    This Month
                  </span>
                </div>

                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        stroke="#25334D"
                        strokeDasharray="4 5"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#8291AC", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#8291AC", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#111B30",
                          border: "1px solid #354266",
                          borderRadius: "10px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="previous"
                        name="Last Month"
                        stroke="#168DFF"
                        strokeWidth={2.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="current"
                        name="This Month"
                        stroke="#C044FF"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="min-w-0 rounded-xl border border-slate-800 bg-[#101A32] p-5">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Recent Activity
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Latest workspace updates
                  </p>
                </div>

                <div className="mt-5 space-y-5">
                  {activities.map((activity) => {
                    const Icon = activity.icon;

                    return (
                      <div className="flex gap-3" key={activity.title}>
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activity.bg} ${activity.color}`}
                        >
                          <Icon size={17} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-200">
                            {activity.title}
                          </h4>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {activity.description}
                          </p>
                          <span className="mt-2 flex items-center gap-1 text-[9px] text-slate-500">
                            <Clock3 size={11} />
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button className="mt-6 w-full border-t border-slate-800 pt-4 text-xs font-medium text-blue-400 hover:text-blue-300">
                  View all activity →
                </button>
              </div>
            </section>

            {/* Projects Table */}
            <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#101A32]">
              <div className="flex items-center justify-between gap-3 p-5">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Project Progress
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Monitor all your active projects
                  </p>
                </div>
                <button className="whitespace-nowrap text-[10px] font-semibold text-blue-400 hover:text-blue-300">
                  View All Projects →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="border-y border-slate-800 bg-[#0B1428]">
                    <tr className="text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-4 font-semibold">Project</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Deadline</th>
                      <th className="px-5 py-4 font-semibold">Progress</th>
                      <th className="px-5 py-4 font-semibold">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="transition-colors hover:bg-[#172440]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                              <FolderKanban size={17} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-200">
                                {project.name}
                              </p>
                              <p className="mt-1 text-[10px] text-slate-500">
                                {project.category}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[9px] font-semibold ${statusStyles[project.status]}`}
                          >
                            {project.status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-[11px] text-slate-400">
                          {project.deadline}
                        </td>

                        <td className="min-w-[170px] px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                              <div
                                className={`h-full rounded-full ${project.color}`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="w-8 text-[10px] text-slate-400">
                              {project.progress}%
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <button className="text-slate-500 hover:text-white">
                            <MoreHorizontal size={19} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredProjects.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-10 text-center text-sm text-slate-500"
                        >
                          No projects found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <footer className="flex flex-col justify-between gap-2 pb-3 text-[10px] text-slate-600 sm:flex-row">
              <span>© 2026 TaskFlow. All rights reserved.</span>
              <span>Manage your work. Stay productive.</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
