
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin
        ? "/auth/login"
        : "/auth/register";

      const { data } = await api.post(endpoint, form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1B] text-white flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">

      {/* Background effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/20 blur-[120px] rounded-full" />

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 bg-[#111A2E]/90 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl">

        {/* Left branding section */}
        <div className="hidden lg:flex flex-col justify-between p-14 bg-gradient-to-br from-[#172344] via-[#17213D] to-[#111A2E] relative overflow-hidden">

          <div className="absolute w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -top-20 -right-20" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">
                T
              </div>
              <span className="text-2xl font-bold tracking-tight">
                TaskFlow
              </span>
            </div>

            <div className="mt-24">
              <p className="text-indigo-300 font-semibold text-sm uppercase tracking-[3px] mb-5">
                Work smarter. Together.
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Bring your
                <span className="block bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                  projects to life.
                </span>
              </h1>

              <p className="text-slate-400 text-lg mt-6 leading-8 max-w-md">
                Organize your work, manage your team,
                and track every milestone — all in
                one simple workspace.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-5">
            {[
              "Manage projects in one place",
              "Track tasks and team progress",
              "Stay focused on what matters"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm">
                  ✓
                </div>
                {item}
              </div>
            ))}

            <p className="text-slate-500 text-sm pt-8">
              © 2026 TaskFlow. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right authentication section */}
        <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16">

          <div className="w-full max-w-md">

            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 text-2xl font-bold mb-3">
                T
              </div>
              <h1 className="text-3xl font-bold">TaskFlow</h1>
              <p className="text-slate-400 mt-2">
                Manage your projects smarter.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-indigo-400 font-semibold text-sm mb-3">
                {isLogin ? "WELCOME BACK" : "GET STARTED"}
              </p>

              <h2 className="text-3xl font-bold">
                {isLogin ? "Sign in to your account" : "Create your account"}
              </h2>

              <p className="text-slate-400 mt-3">
                {isLogin
                  ? "Enter your details to continue to TaskFlow."
                  : "Join TaskFlow and organize your work better."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {!isLogin && (
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-[#1B2942] border border-slate-700 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[#1B2942] border border-slate-700 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-3.5 pr-20 rounded-xl bg-[#1B2942] border border-slate-700 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-indigo-300 hover:text-sky-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Password must be at least 8 characters.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 shadow-lg shadow-indigo-600/20 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                    ? "Sign In →"
                    : "Create Account →"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-xs text-slate-500">
                TASKFLOW WORKSPACE
              </span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            <p className="text-center text-slate-400 text-sm">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setShowPassword(false);
                }}
                className="ml-2 text-indigo-400 font-semibold hover:text-sky-300 transition"
              >
                {isLogin ? "Create account" : "Sign in"}
              </button>
            </p>

            <p className="text-center text-slate-600 text-xs mt-10">
              Secure workspace · Built for productive teams
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
