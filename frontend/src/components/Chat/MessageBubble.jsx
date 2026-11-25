
import {
  Bot,
  User,
  FileText,
  Image as ImageIcon,
  File,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(mimeType = "") {
  if (mimeType.startsWith("image/")) {
    return <ImageIcon size={20} />;
  }

  if (
    mimeType === "application/pdf" ||
    mimeType.includes("wordprocessingml") ||
    mimeType.startsWith("text/")
  ) {
    return <FileText size={20} />;
  }

  return <File size={20} />;
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const attachments = message.attachments || [];

  return (
    <div
      className={`message-row ${
        isUser ? "user-message" : "buddy-message"
      }`}
    >
      <div className="message-avatar">
        {isUser ? <User size={18} /> : <Bot size={19} />}
      </div>

      <div className="message-content">
        <span className="message-sender">
          {isUser ? "You" : "Buddy"}
        </span>

        <div
          className={`message-bubble ${
            !isUser ? "buddy-markdown" : ""
          }`}
        >
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),

                pre: ({ node, ...props }) => (
                  <pre
                    className="markdown-code-block"
                    {...props}
                  />
                ),

                code: ({ node, className, children, ...props }) => {
                  const isBlock = Boolean(className);

                  return isBlock ? (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ) : (
                    <code
                      className="markdown-inline-code"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content || ""}
            </ReactMarkdown>
          )}
        </div>

        {/* Uploaded file attachments */}
        {isUser && attachments.length > 0 && (
          <div className="message-attachments">
            {attachments.map((attachment, index) => (
              <div
                className="message-attachment-card"
                key={`${attachment.name}-${index}`}
              >
                <div className="message-attachment-icon">
                  {getFileIcon(attachment.mimeType)}
                </div>

                <div className="message-attachment-info">
                  <span className="message-attachment-name">
                    {attachment.name}
                  </span>

                  <span className="message-attachment-size">
                    {formatFileSize(attachment.size)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
