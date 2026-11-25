
import { useState } from "react";
import {
  User,
  Palette,
  Bot,
  MessageSquare,
  ShieldCheck,
  Info,
  Sun,
  Moon,
  Check,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI Preferences", icon: Bot },
  { id: "chat", label: "Chat Preferences", icon: MessageSquare },
  { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
  { id: "about", label: "About Buddy", icon: Info },
];

function SettingsPage({ user }) {
  const { theme, toggleTheme } = useTheme();

  const [activeSection, setActiveSection] = useState("profile");

  const [preferences, setPreferences] = useState(() => {
    try {
      return {
        responseStyle:
          localStorage.getItem("buddy-response-style") || "Balanced",
        responseLength:
          localStorage.getItem("buddy-response-length") || "Balanced",
        personality:
          localStorage.getItem("buddy-personality") || "Supportive",
        enterBehavior:
          localStorage.getItem("buddy-enter-behavior") || "Send message",
      };
    } catch {
      return {
        responseStyle: "Balanced",
        responseLength: "Balanced",
        personality: "Supportive",
        enterBehavior: "Send message",
      };
    }
  });

  const updatePreference = (key, value) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: value,
    }));

    const storageKeys = {
      responseStyle: "buddy-response-style",
      responseLength: "buddy-response-length",
      personality: "buddy-personality",
      enterBehavior: "buddy-enter-behavior",
    };

    try {
      localStorage.setItem(storageKeys[key], value);
    } catch (error) {
      console.error("Saving preference failed:", error);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <>
            <div className="settings-page-heading">
              <h2>Profile</h2>
              <p>View your Buddy account information.</p>
            </div>

            <div className="settings-content-card">
              <div className="settings-large-avatar">
                <User size={34} />
              </div>

              <h3>{user?.name || "Buddy User"}</h3>
              <p className="settings-user-email">
                {user?.email || "No email available"}
              </p>

              <div className="settings-info-grid">
                <div className="settings-info-item">
                  <span>Full Name</span>
                  <strong>{user?.name || "Not available"}</strong>
                </div>

                <div className="settings-info-item">
                  <span>Email Address</span>
                  <strong>{user?.email || "Not available"}</strong>
                </div>
              </div>

              <p className="settings-note">
                Your account details are currently displayed as
                read-only information.
              </p>
            </div>
          </>
        );

      case "appearance":
        return (
          <>
            <div className="settings-page-heading">
              <h2>Appearance</h2>
              <p>Personalize the look and feel of Buddy.</p>
            </div>

            <div className="settings-content-card">
              <h3>Choose your theme</h3>
              <p className="settings-card-description">
                Select the appearance you prefer.
              </p>

              <div className="settings-theme-grid">
                <button
                  className={`settings-theme-card ${
                    theme === "light" ? "selected" : ""
                  }`}
                  onClick={() => {
                    if (theme !== "light") toggleTheme();
                  }}
                >
                  <Sun size={28} />
                  <strong>Light Mode</strong>
                  <span>Bright and clean appearance</span>
                  {theme === "light" && <Check size={19} />}
                </button>

                <button
                  className={`settings-theme-card ${
                    theme === "dark" ? "selected" : ""
                  }`}
                  onClick={() => {
                    if (theme !== "dark") toggleTheme();
                  }}
                >
                  <Moon size={28} />
                  <strong>Dark Mode</strong>
                  <span>Comfortable low-light appearance</span>
                  {theme === "dark" && <Check size={19} />}
                </button>
              </div>
            </div>
          </>
        );

      case "ai":
        return (
          <>
            <div className="settings-page-heading">
              <h2>AI Preferences</h2>
              <p>Personalize how Buddy communicates with you.</p>
            </div>

            <div className="settings-content-card">
              <div className="settings-control-group">
                <label htmlFor="response-style">Response Style</label>
                <p>Choose how Buddy should communicate.</p>
                <select
                  id="response-style"
                  value={preferences.responseStyle}
                  onChange={(event) =>
                    updatePreference("responseStyle", event.target.value)
                  }
                >
                  <option>Friendly</option>
                  <option>Professional</option>
                  <option>Balanced</option>
                </select>
              </div>

              <div className="settings-control-group">
                <label htmlFor="response-length">Response Length</label>
                <p>Choose how detailed Buddy's replies should be.</p>
                <select
                  id="response-length"
                  value={preferences.responseLength}
                  onChange={(event) =>
                    updatePreference("responseLength", event.target.value)
                  }
                >
                  <option>Short</option>
                  <option>Balanced</option>
                  <option>Detailed</option>
                </select>
              </div>

              <div className="settings-control-group">
                <label htmlFor="personality">Buddy's Personality</label>
                <p>Choose the personality you prefer.</p>
                <select
                  id="personality"
                  value={preferences.personality}
                  onChange={(event) =>
                    updatePreference("personality", event.target.value)
                  }
                >
                  <option>Supportive</option>
                  <option>Cheerful</option>
                  <option>Calm</option>
                </select>
              </div>

              <p className="settings-note">
                These preferences are saved on this device.
                They will be connected to Buddy's AI responses in a
                later integration step.
              </p>
            </div>
          </>
        );

      case "chat":
        return (
          <>
            <div className="settings-page-heading">
              <h2>Chat Preferences</h2>
              <p>Customize your messaging experience.</p>
            </div>

            <div className="settings-content-card">
              <div className="settings-control-group">
                <label htmlFor="enter-behavior">
                  Enter Key Behavior
                </label>
                <p>Choose what happens when you press Enter.</p>
                <select
                  id="enter-behavior"
                  value={preferences.enterBehavior}
                  onChange={(event) =>
                    updatePreference("enterBehavior", event.target.value)
                  }
                >
                  <option>Send message</option>
                  <option>New line</option>
                </select>
              </div>

              <p className="settings-note">
                Shift + Enter can be used to create a new line.
                This preference is saved locally; connecting it
                to the chat input is a separate step.
              </p>
            </div>
          </>
        );

      case "privacy":
        return (
          <>
            <div className="settings-page-heading">
              <h2>Privacy & Security</h2>
              <p>Information about your account and data.</p>
            </div>

            <div className="settings-content-card">
              <div className="settings-security-item">
                <ShieldCheck size={25} />
                <div>
                  <strong>Protected Account</strong>
                  <p>
                    Buddy uses authenticated accounts to protect
                    access to your conversations.
                  </p>
                </div>
              </div>

              <div className="settings-security-item">
                <MessageSquare size={25} />
                <div>
                  <strong>Conversation History</strong>
                  <p>
                    You can manage your saved conversations from
                    the sidebar.
                  </p>
                </div>
              </div>

              <p className="settings-note">
                Password changes and account deletion are not
                available in this settings interface yet.
              </p>
            </div>
          </>
        );

      case "about":
        return (
          <>
            <div className="settings-page-heading">
              <h2>About Buddy</h2>
              <p>Get to know your AI friend and smart assistant.</p>
            </div>

            <div className="settings-content-card settings-about-card">
              <div className="settings-about-logo">
                <User size={35} />
              </div>

              <h3>Buddy AI Friend</h3>
              <p>
                Your friendly AI companion for conversations,
                learning, ideas and everyday assistance.
              </p>

              <div className="settings-about-details">
                <div>
                  <span>Application</span>
                  <strong>Buddy AI Friend</strong>
                </div>
                <div>
                  <span>Version</span>
                  <strong>1.0.0</strong>
                </div>
                <div>
                  <span>Technology</span>
                  <strong>React, Node.js & AI</strong>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-dashboard">
      <header className="settings-page-topbar">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and personalize Buddy.</p>
        </div>
      </header>

      <div className="settings-dashboard-layout">
        <nav className="settings-navigation">
          <p className="settings-nav-label">GENERAL</p>

          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                className={`settings-nav-item ${
                  activeSection === section.id ? "active" : ""
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon size={19} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>

        <section className="settings-main-content">
          {renderSection()}
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
