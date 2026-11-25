import { useEffect, useRef } from "react";
import { Sparkles, Bot } from "lucide-react";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

function ChatWindow({ messages, onSend, loading = false }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <section className="chat-window">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="empty-state-icon">
              <Sparkles size={30} />
            </div>

            <h2>What's on your mind?</h2>

            <p>
              I'm Buddy, your AI friend and smart assistant.
              You can talk to me, ask questions, or get help with anything.
            </p>

            <div className="suggestion-list">
              <button
                type="button"
                onClick={() => onSend("Tell me something interesting.")}
              >
                <Sparkles size={16} />
                Tell me something interesting
              </button>

              <button
                type="button"
                onClick={() => onSend("Help me plan my day.")}
              >
                <Bot size={16} />
                Help me plan my day
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))
        )}

        {loading && (
          <div className="typing-indicator">
            <div className="message-avatar">
              <Bot size={19} />
            </div>

            <div className="typing-content">
              <span>Buddy is thinking</span>
              <div className="typing-dots">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={onSend} disabled={loading} />
    </section>
  );
}

export default ChatWindow;
