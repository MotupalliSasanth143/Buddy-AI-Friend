
import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import generateBuddyResponse from "../services/groqService.js";
import analyzeUploadedFiles from "../services/fileAnalysisService.js";

const MAX_HISTORY_MESSAGES = 8;
const MAX_HISTORY_CHARACTERS = 12000;
const MAX_DOCUMENT_CONTEXT = 10000;

// Split document text into searchable sections.
const splitIntoChunks = (text, chunkSize = 1500) => {
  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
};

// Retrieve relevant document sections using simple keyword matching.
const retrieveRelevantDocumentText = (
  messages,
  query,
  maxCharacters = MAX_DOCUMENT_CONTEXT
) => {
  const documents = messages
    .filter((item) => item.analysisContext?.trim())
    .map((item) => ({
      name: item.attachments?.map((file) => file.name).join(", ") || "Uploaded document",
      text: item.analysisContext,
    }));

  if (documents.length === 0) {
    return "";
  }

  const stopWords = new Set([
    "the", "and", "for", "that", "this", "with",
    "from", "what", "when", "where", "which",
    "who", "how", "are", "was", "were", "you",
    "your", "can", "could", "please", "explain",
    "tell", "about", "into", "have", "has",
  ]);

  const keywords = query
    .toLowerCase()
    .match(/[a-z0-9]{3,}/g) || [];

  const usefulKeywords = [
    ...new Set(keywords.filter((word) => !stopWords.has(word))),
  ];

  const rankedChunks = [];

  for (const document of documents) {
    const chunks = splitIntoChunks(document.text);

    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index];
      const lowerChunk = chunk.toLowerCase();

      const score = usefulKeywords.reduce(
        (total, keyword) =>
          total + (lowerChunk.includes(keyword) ? 1 : 0),
        0
      );

      if (score > 0) {
        rankedChunks.push({
          name: document.name,
          text: chunk,
          score,
          index,
        });
      }
    }
  }

  rankedChunks.sort((a, b) => b.score - a.score);

  let result = "";
  const selected = [];

  for (const chunk of rankedChunks) {
    const section =
      `DOCUMENT: ${chunk.name}\n` +
      `SECTION ${chunk.index + 1}:\n${chunk.text}`;

    if (result.length + section.length > maxCharacters) {
      continue;
    }

    selected.push(section);
    result += (result ? "\n\n" : "") + section;

    if (result.length >= maxCharacters * 0.9) {
      break;
    }
  }

  // If no keywords matched, return a small excerpt from the latest document.
  if (!result && documents.length > 0) {
    result = documents
      .slice(-1)[0]
      .text.slice(0, maxCharacters);
  }

  return result;
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId, message = "" } = req.body;
    const files = req.files || [];

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID.",
      });
    }

    if (
      typeof message !== "string" ||
      message.trim().length > 10000 ||
      (!message.trim() && files.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message or upload a file.",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const {
      attachments,
      imageParts,
      extractedText,
    } = await analyzeUploadedFiles(files);

    const userMessage =
      message.trim() ||
      `Please analyze the uploaded file${files.length > 1 ? "s" : ""}.`;

    // Build recent chat history without repeating stored document text.
    const chatHistory = conversation.messages
      .slice(-MAX_HISTORY_MESSAGES)
      .map((item) => ({
        role: item.role,
        content: item.content.slice(0, 1500),
      }));

    let aiMessage = userMessage;

    // Retrieve relevant sections from previously uploaded documents.
    const documentContext = retrieveRelevantDocumentText(
      conversation.messages,
      userMessage
    );

    // Newly uploaded documents take priority.
    const contextToUse = extractedText
      ? extractedText.slice(0, MAX_DOCUMENT_CONTEXT)
      : documentContext;

    if (contextToUse) {
      aiMessage +=
        "\n\nRelevant uploaded document content:\n" +
        contextToUse +
        "\n\nUse this document content as the source for document-related answers. If the requested information is not present, say so.";
    }

    // Limit total text sent to the AI.
    const historyBudget = MAX_HISTORY_CHARACTERS;
    let usedCharacters = aiMessage.length;

    const safeHistory = [];

    for (const item of [...chatHistory].reverse()) {
      if (usedCharacters >= historyBudget) break;

      const remaining = historyBudget - usedCharacters;
      const content = item.content.slice(0, remaining);

      if (content.trim()) {
        safeHistory.unshift({
          role: item.role,
          content,
        });

        usedCharacters += content.length;
      }
    }

    safeHistory.push({
      role: "user",
      content: aiMessage.slice(0, MAX_HISTORY_CHARACTERS),
    });

    const reply = await generateBuddyResponse(safeHistory, {
      imageParts,
    });

    if (conversation.messages.length === 0) {
      conversation.title =
        userMessage.length > 50
          ? `${userMessage.slice(0, 47)}...`
          : userMessage;
    }

    // Save full document text in MongoDB, not in every AI prompt.
    conversation.messages.push({
      role: "user",
      content: userMessage,
      attachments,
      analysisContext: extractedText,
    });

    conversation.messages.push({
      role: "assistant",
      content: reply,
    });

    await conversation.save();

    return res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
      updatedAt: conversation.updatedAt,
      attachments,
    });
  } catch (error) {
    console.error("Chat controller error:", error.message);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Buddy could not process your message. Please try again.",
    });
  }
};

export { sendMessage };
