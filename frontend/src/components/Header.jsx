
import { Search, Bell, Plus } from "lucide-react";

const Header = ({ user, onCreateTicket }) => {
  return (
    <header className="h-20 border-b border-slate-800 flex items-center justify-between px-6 md:px-8">

      <div>
        <h2 className="text-xl font-semibold text-white">
          Welcome back, {user?.name || "User"}
        </h2>
        <p className="text-sm text-slate-400">
          Here's what's happening with your projects.
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button className="text-slate-400 hover:text-white">
          <Search size={21} />
        </button>

        <button className="text-slate-400 hover:text-white">
          <Bell size={21} />
        </button>

        <button
          onClick={onCreateTicket}
          className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2.5 rounded-lg font-semibold hover:bg-yellow-300"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Create Ticket</span>
        </button>

      </div>

    </header>
  );
};

export default Header;
