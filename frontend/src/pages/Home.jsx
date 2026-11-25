
import { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Plus,
  LogOut,
  Menu,
  User,
  Settings,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";

import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import ChatWindow from "../components/Chat/ChatWindow";
import SettingsPage from "./Settings";

import {
  chatAPI,
  conversationAPI,
} from "../services/api";

function Home() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("chat");

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Navigate to Buddy main page
  const handleGoHome = () => {
    setActiveView("chat");
    setMessages([]);
    setCurrentConversationId(null);
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Load conversation history
  const loadConversations = async () => {
    try {
      const response = await conversationAPI.getConversations();
      setConversations(response.conversations || []);
    } catch (error) {
      console.error("Loading conversations failed:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Create a new conversation
  const handleNewChat = async () => {
    if (loading) return;

    try {
      const response = await conversationAPI.createConversation();

      setCurrentConversationId(response.conversation._id);
      setMessages([]);
      setActiveView("chat");
      setMenuOpen(false);

      await loadConversations();
    } catch (error) {
      console.error("Creating conversation failed:", error);
      alert(error.message || "Unable to create a new conversation.");
    }
  };

  // Send a message with optional file attachments
  const handleSend = async (content, files = []) => {
    const trimmedContent = content.trim();

    if ((!trimmedContent && files.length === 0) || loading) return;

    const displayContent =
      trimmedContent ||
      `Please analyze the uploaded file${files.length > 1 ? "s" : ""}.`;

    const attachments = files.map((file) => ({
      name: file.name,
      mimeType: file.type,
      size: file.size,
    }));

    // Display user's message immediately
    const newMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: displayContent,
      attachments,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      newMessage,
    ]);

    setMenuOpen(false);
    setLoading(true);

    try {
      let conversationId = currentConversationId;

      // Create conversation if one doesn't exist
      if (!conversationId) {
        const createResponse =
          await conversationAPI.createConversation();

        conversationId = createResponse.conversation._id;
        setCurrentConversationId(conversationId);
      }

      // Send text and files to backend
      const response = await chatAPI.sendMessage(
        conversationId,
        trimmedContent,
        files
      );

      if (!response.reply) {
        throw new Error("Buddy returned an empty response.");
      }

      // Display Buddy's response
      const buddyMessage = {
        id: crypto.randomUUID(),
        role: "model",
        content: response.reply,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        buddyMessage,
      ]);

      await loadConversations();
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage = {
        id: crypto.randomUUID(),
        role: "model",
        content:
          error.message ||
          "Sorry, I couldn't respond. Please try again.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Open an existing conversation
  const handleOpenConversation = async (conversationId) => {
    if (loading) return;

    try {
      setLoading(true);

      const response =
        await conversationAPI.getConversation(conversationId);

      const conversation = response.conversation;

      setCurrentConversationId(conversation._id);

      const formattedMessages = conversation.messages.map(
        (message) => ({
          id: message._id || crypto.randomUUID(),
          role: message.role === "assistant" ? "model" : "user",
          content: message.content,
          attachments: message.attachments || [],
        })
      );

      setMessages(formattedMessages);
      setActiveView("chat");
      setMenuOpen(false);
    } catch (error) {
      console.error("Opening conversation failed:", error);
      alert(error.message || "Unable to open this conversation.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (conversationId) => {
    if (loading) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (!confirmed) return;

    try {
      await conversationAPI.deleteConversation(conversationId);

      setConversations((previous) =>
        previous.filter(
          (conversation) => conversation._id !== conversationId
        )
      );

      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Deleting conversation failed:", error);
      alert(error.message || "Unable to delete conversation.");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="buddy-dashboard chat-dashboard">

      {/* Sidebar */}
      <aside className={`buddy-sidebar ${menuOpen ? "open" : ""}`}>

        {/* Clickable Buddy Logo */}
        <button
          type="button"
          className="sidebar-brand"
          onClick={handleGoHome}
          title="Go to Buddy Home"
          aria-label="Go to Buddy Home"
        >
          <div className="brand-icon">
            <Heart size={23} fill="white" />
          </div>
          <h2>Buddy</h2>
        </button>

        {/* New Chat */}
        <button
          className="new-chat-button"
          onClick={handleNewChat}
          disabled={loading}
        >
          <Plus size={18} />
          New Chat
        </button>

        {/* Settings Navigation */}
        <div className="sidebar-section">
          <p className="sidebar-label">PREFERENCES</p>

          <button
            className={`sidebar-link ${
              activeView === "settings" ? "active" : ""
            }`}
            onClick={() => {
              setActiveView("settings");
              setMenuOpen(false);
            }}
          >
            <Settings size={19} />
            Settings
          </button>
        </div>

        {/* Conversation History */}
        <div className="sidebar-history">
          <p className="sidebar-label">CONVERSATIONS</p>

          {historyLoading ? (
            <p className="no-history">
              Loading conversations...
            </p>
          ) : conversations.length === 0 ? (
            <p className="no-history">
              Your conversations will appear here.
            </p>
          ) : (
            <div className="conversation-list">
              {conversations.map((conversation) => (
                <div
                  className={`conversation-history-item ${
                    currentConversationId === conversation._id &&
                    activeView === "chat"
                      ? "active"
                      : ""
                  }`}
                  key={conversation._id}
                >
                  <button
                    className="conversation-open-button"
                    onClick={() =>
                      handleOpenConversation(conversation._id)
                    }
                    disabled={loading}
                    title={conversation.title}
                  >
                    <MessageCircle size={16} />

                    <span>
                      {conversation.title || "New Chat"}
                    </span>
                  </button>

                  <button
                    className="conversation-delete-button"
                    onClick={() =>
                      handleDeleteConversation(conversation._id)
                    }
                    disabled={loading}
                    title="Delete conversation"
                    aria-label="Delete conversation"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile and Logout */}
        <div className="sidebar-bottom">
          <div className="profile-avatar">
            <User size={20} />
          </div>

          <div className="profile-info">
            <strong>{user?.name || "Buddy User"}</strong>
            <span>{user?.email || ""}</span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign out"
          >
            <LogOut size={19} />
          </button>
        </div>
      </aside>

      {/* Full-page Settings */}
      {activeView === "settings" ? (
        <main className="buddy-main settings-main">
          <SettingsPage user={user} />
        </main>
      ) : (

        /* Main Chat Area */
        <main className="buddy-main chat-main">

          {/* Video Background */}
          <video
            className="buddy-video-background"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source
              src="/videos/buddy-background.mp4"
              type="video/mp4"
            />
          </video>

          <div
            className="buddy-video-overlay"
            aria-hidden="true"
          />

          {/* Chat Header */}
          <header className="dashboard-header chat-header">

            <button
              className="mobile-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={23} />
            </button>

            <div className="chat-header-title">
              <h2>Buddy AI Assistant</h2>
              <p>Your friend and smart assistant</p>
            </div>

            <div className="header-actions">

              <button
                className="theme-toggle-button"
                onClick={toggleTheme}
                title={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon size={20} />
                ) : (
                  <Sun size={20} />
                )}
              </button>

              <div className="online-status">
                <span />
                {loading ? "Thinking..." : "Ready to chat"}
              </div>

            </div>
          </header>

          {/* Chat Window */}
          <div className="chat-content">
            <ChatWindow
              messages={messages}
              onSend={handleSend}
              loading={loading}
            />
          </div>

          {/* Footer */}
          <footer className="dashboard-footer">
            Made with{" "}
            <Heart size={14} fill="currentColor" /> by Buddy
          </footer>

        </main>
      )}

    </div>
  );
}

export default Home;
