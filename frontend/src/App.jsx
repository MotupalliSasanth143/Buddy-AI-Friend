
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./components/Auth/AuthPage";
import Home from "./pages/Home";

import useAuth from "./hooks/useAuth";
import { ThemeProvider } from "./context/ThemeContext";

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <h2>Buddy is getting ready...</h2>
      <p>Please wait a moment.</p>
    </div>
  );
}

// Only authenticated users can access the chat dashboard.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? children : <Navigate to="/login" replace />;
}

// Redirect authenticated users away from the login page.
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <Navigate to="/home" replace /> : children;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Buddy welcome page */}
          <Route
            path="/"
            element={<LandingPage />}
          />

          {/* Login and registration */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* Protected chat dashboard */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Unknown routes */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
