
import { useRef, useState } from "react";
import {
  Send,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
];

function ChatInput({ onSend, disabled = false }) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState("");

  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const newFiles = Array.from(event.target.files || []);
    setFileError("");

    const validFiles = [];

    for (const file of newFiles) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setFileError(`${file.name}: Unsupported file type.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError(`${file.name}: File must be smaller than 10 MB.`);
        continue;
      }

      validFiles.push(file);
    }

    setSelectedFiles((previousFiles) => {
      const combined = [...previousFiles, ...validFiles];

      if (combined.length > MAX_FILES) {
        setFileError("You can upload a maximum of 5 files.");
        return combined.slice(0, MAX_FILES);
      }

      const imageCount = combined.filter((file) =>
        file.type.startsWith("image/")
      ).length;

      if (imageCount > 3) {
        setFileError("You can upload a maximum of 3 images per message.");
        return combined.filter((file) => !file.type.startsWith("image/"))
          .concat(
            combined
              .filter((file) => file.type.startsWith("image/"))
              .slice(0, 3)
          )
          .slice(0, MAX_FILES);
      }

      return combined;
    });

    event.target.value = "";
  };

  const removeFile = (index) => {
    setSelectedFiles((previousFiles) =>
      previousFiles.filter((_, fileIndex) => fileIndex !== index)
    );
    setFileError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if ((!trimmedMessage && selectedFiles.length === 0) || disabled) {
      return;
    }

    onSend(trimmedMessage, selectedFiles);

    setMessage("");
    setSelectedFiles([]);
    setFileError("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.txt,.csv"
        onChange={handleFileSelect}
      />

      {selectedFiles.length > 0 && (
        <div className="chat-attachments">
          {selectedFiles.map((file, index) => (
            <div className="attachment-preview" key={`${file.name}-${index}`}>
              <div className="attachment-icon">
                {file.type.startsWith("image/") ? (
                  <ImageIcon size={19} />
                ) : (
                  <FileText size={19} />
                )}
              </div>

              <div className="attachment-details">
                <span className="attachment-name">{file.name}</span>
                <span className="attachment-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>

              <button
                type="button"
                className="attachment-remove"
                onClick={() => removeFile(index)}
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {fileError && (
        <p className="attachment-error" role="alert">
          {fileError}
        </p>
      )}

      <div className="chat-input-box">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Buddy..."
          rows={1}
          disabled={disabled}
        />

        <div className="chat-input-actions">
          <div className="chat-input-left">
            <button
              type="button"
              className="attachment-picker-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || selectedFiles.length >= MAX_FILES}
              title="Attach files"
              aria-label="Attach files"
            >
              <Paperclip size={19} />
            </button>

            <span className="input-hint">
              Attach images or documents
            </span>
          </div>

          <button
            type="submit"
            className="send-button"
            disabled={
              disabled ||
              (!message.trim() && selectedFiles.length === 0)
            }
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <p className="chat-disclaimer">
        Buddy can make mistakes. Check important information.
      </p>
    </form>
  );
}

export default ChatInput;
