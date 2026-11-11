
import {
  LayoutDashboard,
  FolderKanban,
  Ticket,
  Users,
  Settings,
  LogOut,
  Zap
} from "lucide-react";

const Sidebar = ({ active, setActive, onLogout }) => {

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Projects", icon: FolderKanban },
    { name: "Tickets", icon: Ticket },
    { name: "Team", icon: Users }
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 p-5 flex flex-col">

      <div className="flex items-center gap-3 mb-10">
        <div className="bg-yellow-400 p-2 rounded-lg">
          <Zap className="text-black" size={22} />
        </div>
        <h1 className="text-2xl font-bold text-white">
          TaskFlow
        </h1>
      </div>

      <p className="text-xs text-slate-500 uppercase mb-4">
        Workspace
      </p>

      <nav className="space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                active === item.name
                  ? "bg-yellow-400 text-black font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </button>
          );
        })}

      </nav>

      <div className="mt-auto space-y-3">

        <button className="flex items-center gap-3 text-slate-400 p-3 hover:text-white">
          <Settings size={20} />
          Settings
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-red-400 p-3 hover:bg-slate-900 w-full rounded-xl"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
