
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Plus,
  FolderKanban,
  Trash2,
  Users,
  Loader2
} from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: ""
  });
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/projects", form);

      setForm({
        title: "",
        description: ""
      });

      setShowForm(false);
      await fetchProjects();

    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/projects/${id}`);
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-10">

          <div>
            <h1 className="text-3xl font-bold">
              My Projects
            </h1>

            <p className="text-slate-400 mt-2">
              Manage your team's projects in one place.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 bg-yellow-400 text-black px-5 py-3 rounded-xl font-semibold hover:bg-yellow-300"
          >
            <Plus size={20} />
            Create Project
          </button>

        </div>

        {error && (
          <p className="text-red-400 mb-5">{error}</p>
        )}

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 space-y-4"
          >
            <h2 className="text-xl font-semibold">
              New Project
            </h2>

            <input
              type="text"
              placeholder="Project title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
              minLength={3}
              className="w-full p-3 bg-slate-800 rounded-lg outline-none"
            />

            <textarea
              placeholder="Project description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded-lg outline-none"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold"
              >
                Save Project
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-700 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl">
            <FolderKanban
              size={45}
              className="mx-auto text-slate-500 mb-4"
            />
            <h2 className="text-xl font-semibold">
              No projects yet
            </h2>
            <p className="text-slate-400 mt-2">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-yellow-400 transition"
              >
                <div className="flex justify-between items-start">

                  <div className="bg-yellow-400/10 p-3 rounded-xl">
                    <FolderKanban
                      className="text-yellow-400"
                      size={24}
                    />
                  </div>

                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-slate-400 hover:text-red-400"
                    title="Delete project"
                  >
                    <Trash2 size={19} />
                  </button>

                </div>

                <h2 className="text-xl font-semibold mt-5">
                  {project.title}
                </h2>

                <p className="text-slate-400 text-sm mt-2 min-h-10">
                  {project.description || "No description"}
                </p>

                <div className="flex items-center gap-2 text-slate-400 mt-5 pt-4 border-t border-slate-800">
                  <Users size={18} />
                  <span className="text-sm">
                    {project.teamMembers.length} Team Members
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Projects;
