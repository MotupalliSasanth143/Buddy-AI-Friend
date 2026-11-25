import { useState } from "react";
import {
  Heart,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

function AuthPage() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && !formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const userData = {
        email: formData.email.trim(),
        password: formData.password,
      };

      if (mode === "register") {
        await register({
          ...userData,
          name: formData.name.trim(),
        });
      } else {
        await login(userData);
      }

      // App.jsx automatically redirects authenticated users to /home.
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-icon">
            <Heart size={28} fill="white" />
          </div>
          <h1>Buddy</h1>
          <p>Your AI friend, always here for you.</p>
        </div>

        <div className="auth-welcome">
          <Sparkles size={20} />
          <h2>
            {mode === "login"
              ? "Welcome Back!"
              : "Create Your Account"}
          </h2>
          <p>
            {mode === "login"
              ? "Your friendly AI companion is waiting."
              : "Let's start your journey with Buddy."}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          {mode === "register" && (
            <div className="auth-field">
              <label>Full Name</label>
              <div className="auth-input">
                <User size={19} />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={50}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label>Email Address</label>
            <div className="auth-input">
              <Mail size={19} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input">
              <Lock size={19} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                minLength={8}
                maxLength={72}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}

            {!loading && <Sparkles size={18} />}
          </button>

        </form>

        <div className="auth-footer">
          Made with <Heart size={14} fill="currentColor" /> for you
        </div>

      </div>
    </div>
  );
}

export default AuthPage;
