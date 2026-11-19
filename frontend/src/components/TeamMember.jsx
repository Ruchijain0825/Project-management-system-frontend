
import { useCallback, useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Mail,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";

const roles = ["admin", "manager", "developer", "viewer"];

const getId = (item) => item?._id || item?.id || "";

const getError = (err) =>
  err?.response?.data?.message ||
  err?.message ||
  "Something went wrong.";

const getMembers = (data) => {
  if (Array.isArray(data?.members)) return data.members;
  if (Array.isArray(data?.teamMembers)) return data.teamMembers;
  if (Array.isArray(data?.data?.members)) return data.data.members;
  if (Array.isArray(data?.data?.teamMembers)) return data.data.teamMembers;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
};

export default function TeamMembers({ projects = [], initialProjectId = "" }) {
  const [projectId, setProjectId] = useState(initialProjectId);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("developer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setProjectId(initialProjectId);
  }, [initialProjectId]);

  const fetchMembers = useCallback(async () => {
    if (!projectId) {
      setMembers([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        `/projects/${projectId}/members`
      );

      setMembers(getMembers(data));
    } catch (err) {
      setError(getError(err));
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await api.post(`/projects/${projectId}/members`, {
        email: email.trim().toLowerCase(),
        role,
      });

      setEmail("");
      setRole("developer");
      setShowModal(false);
      setSuccess("Team member added successfully.");

      await fetchMembers();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setError("");

      await api.patch(
        `/projects/${projectId}/members/${userId}/role`,
        { role: newRole }
      );

      setSuccess("Member role updated.");
      await fetchMembers();
    } catch (err) {
      setError(getError(err));
    }
  };

  const handleRemoveMember = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/projects/${projectId}/members`, {
        data: { userId },
      });

      setSuccess("Member removed successfully.");
      await fetchMembers();
    } catch (err) {
      setError(getError(err));
    }
  };

  const filteredMembers = members.filter((member) => {
    const person = member.user || member;
    const query = search.toLowerCase();

    return (
      (person.name || "").toLowerCase().includes(query) ||
      (person.email || "").toLowerCase().includes(query)
    );
  });

  const counts = {
    total: members.length,
    admins: members.filter((m) => m.role === "admin").length,
    developers: members.filter((m) => m.role === "developer").length,
    viewers: members.filter((m) => m.role === "viewer").length,
  };

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">
            Team Members
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage your project team and member permissions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="min-w-0 rounded-lg border border-slate-700 bg-[#101A32] px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-400"
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={getId(project)} value={getId(project)}>
                {project.title || project.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setError("");
              setSuccess("");
              setShowModal(true);
            }}
            disabled={!projectId}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus size={17} />
            Add Member
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
          <CheckCircle2 size={17} />
          {success}
          <button
            onClick={() => setSuccess("")}
            className="ml-auto"
            aria-label="Dismiss success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!projectId ? (
        <div className="rounded-xl border border-slate-800 bg-[#101A32] py-16 text-center">
          <Users size={40} className="mx-auto text-slate-600" />
          <h3 className="mt-4 font-semibold text-white">
            Select a project
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Select a project to manage its team members.
          </p>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Members", value: counts.total, icon: Users },
              { label: "Admins", value: counts.admins, icon: ShieldCheck },
              { label: "Developers", value: counts.developers, icon: Users },
              { label: "Viewers", value: counts.viewers, icon: Users },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800 bg-[#101A32] p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                      {item.label}
                    </p>
                    <Icon size={20} className="text-indigo-400" />
                  </div>
                  <h3 className="mt-3 text-3xl font-bold text-white">
                    {loading ? "..." : item.value}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* MEMBERS TABLE */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#101A32]">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-white">
                  Project Members
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  View and manage members of this project.
                </p>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search members..."
                    className="h-10 w-full rounded-lg border border-slate-700 bg-[#0B1428] pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-400 sm:w-56"
                  />
                </div>

                <button
                  onClick={fetchMembers}
                  disabled={loading}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                  aria-label="Refresh members"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-slate-400">
                Loading team members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-16 text-center">
                <Users size={40} className="mx-auto text-slate-600" />
                <h3 className="mt-4 font-semibold text-white">
                  {search ? "No members found" : "No team members yet"}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {search
                    ? "Try another search."
                    : "Add registered users to your project team."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="bg-[#0B1428] text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Member</th>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {filteredMembers.map((member) => {
                      const person = member.user || member;
                      const userId = getId(person);
                      const name = person.name || "Unknown User";

                      return (
                        <tr
                          key={getId(member) || userId}
                          className="transition hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 font-bold text-white">
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-white">
                                  {name}
                                </p>
                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                  <Mail size={12} />
                                  {person.email || "No email"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={member.role || "developer"}
                              onChange={(e) =>
                                handleRoleChange(userId, e.target.value)
                              }
                              className="rounded-lg border border-slate-700 bg-[#0B1428] px-3 py-2 text-xs capitalize text-slate-200 outline-none focus:border-indigo-400"
                            >
                              {roles.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium capitalize text-emerald-400">
                              {member.status || "active"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleRemoveMember(userId)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                              title="Remove member"
                              aria-label={`Remove ${name}`}
                            >
                              <Trash2 size={17} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ADD MEMBER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#101A32] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Add Team Member
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Add an existing registered user.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@example.com"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1428] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Assign Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0B1428] px-4 py-3 text-sm capitalize text-white outline-none focus:border-indigo-400"
                >
                  {roles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
                >
                  <UserPlus size={16} />
                  {submitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
