
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold">
        Welcome to TaskFlow, {user?.name}!
      </h1>
      <p className="mt-3 text-slate-400">
        Your project management workspace.
      </p>
    </div>
  );
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Auth />}
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
