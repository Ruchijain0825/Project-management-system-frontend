
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-white text-center">
          TaskFlow
        </h1>

        <p className="text-slate-400 text-center mt-2 mb-8">
          Manage your projects smarter.
        </p>

        <h2 className="text-xl font-semibold text-white mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold p-3 rounded-lg disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Register"}
          </button>

        </form>

        <p className="text-slate-400 text-center mt-6">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-yellow-400 ml-2 font-semibold"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Auth;
