
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
console.log("NEW DASHBOARD LOADED");
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token
    ? children
    : <Navigate to="/" replace />;
}

function PublicRoute() {
  const token = localStorage.getItem("token");

  return token
    ? <Navigate to="/dashboard" replace />
    : <Auth />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<PublicRoute />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
