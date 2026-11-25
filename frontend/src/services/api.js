
const API_BASE_URL = "https://buddy-ai-friend-1.onrender.com/api";

const apiRequest = async (endpoint, options = {}) => {
  try {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    return data;
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error(
        "Unable to connect to Buddy's server. Please try again."
      );
    }

    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (userData) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
    }),

  getCurrentUser: () =>
    apiRequest("/auth/me", {
      method: "GET",
    }),
};

// Buddy AI chat API
export const chatAPI = {
  sendMessage: (conversationId, message, files = []) => {
    const formData = new FormData();

    formData.append("conversationId", conversationId);
    formData.append("message", message);

    files.forEach((file) => {
      formData.append("files", file);
    });

    return apiRequest("/chat/send", {
      method: "POST",
      body: formData,
    });
  },
};

// Buddy conversation management API
export const conversationAPI = {
  createConversation: () =>
    apiRequest("/conversations", {
      method: "POST",
    }),

  getConversations: () =>
    apiRequest("/conversations", {
      method: "GET",
    }),

  getConversation: (conversationId) =>
    apiRequest(`/conversations/${conversationId}`, {
      method: "GET",
    }),

  deleteConversation: (conversationId) =>
    apiRequest(`/conversations/${conversationId}`, {
      method: "DELETE",
    }),
};

export default apiRequest;
