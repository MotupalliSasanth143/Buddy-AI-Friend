
import Groq from "groq-sdk";

const SYSTEM_INSTRUCTION = `
You are Buddy, a friendly AI companion and smart assistant.

Your personality:
- Be warm, friendly, respectful, and approachable.
- Talk naturally, like a helpful friend.
- Listen carefully and respond with empathy.
- Help with studies, programming, productivity, ideas,
  explanations, planning, and everyday questions.
- Give short answers for simple questions.
- Give detailed explanations when needed.
- Use clear language and practical examples.
- Never pretend to know information you do not know.

File analysis instructions:
- Analyze uploaded images carefully.
- Answer questions using the actual image content.
- Read and understand provided document excerpts.
- Summarize documents when requested.
- Explain difficult concepts in uploaded files.
- If information is missing or unreadable, say so honestly.
- Never invent content from an uploaded file.
`;

const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_CHARACTERS = 12000;

const generateBuddyResponse = async (
  messages,
  { imageParts = [] } = {}
) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Groq API key is missing.");
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Please provide a conversation message.");
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  // Keep only recent messages and limit text size.
  const recentMessages = messages
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role === "model" ? "assistant" : message.role,
      content:
        typeof message.content === "string"
          ? message.content.slice(0, MAX_MESSAGE_CHARACTERS)
          : "",
    }));

  const chatMessages = [
    {
      role: "system",
      content: SYSTEM_INSTRUCTION,
    },
    ...recentMessages,
  ];

  // Add uploaded images to the latest user message.
  if (imageParts.length > 0) {
    const lastUserIndex = chatMessages.findLastIndex(
      (message) => message.role === "user"
    );

    if (lastUserIndex === -1) {
      throw new Error(
        "No user message was provided for image analysis."
      );
    }

    const lastUserMessage = chatMessages[lastUserIndex];

    chatMessages[lastUserIndex] = {
      ...lastUserMessage,
      content: [
        {
          type: "text",
          text:
            typeof lastUserMessage.content === "string"
              ? lastUserMessage.content
              : "Please analyze the uploaded images.",
        },
        ...imageParts,
      ],
    };
  }

  const hasImages = imageParts.length > 0;

  try {
    const completion = await groq.chat.completions.create({
      model: hasImages
        ? process.env.GROQ_VISION_MODEL || "qwen/qwen3.8-27b"
        : process.env.GROQ_MODEL || "openai/gpt-oss-20b",

      messages: chatMessages,

      temperature: 0.7,
      max_completion_tokens: 2048,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply || typeof reply !== "string") {
      throw new Error("Groq returned an empty response.");
    }

    return reply.trim();
  } catch (error) {
    console.error("Groq API error:", error.message);

    if (
      error.status === 429 ||
      error.status === 413 ||
      error.message?.includes("rate_limit_exceeded")
    ) {
      throw new Error(
        "Buddy has reached the AI usage limit temporarily. Please wait a little and try again with a shorter message or smaller document excerpt."
      );
    }

    throw new Error(
      "Buddy is temporarily unable to analyze this request. Please try again."
    );
  }
};

export default generateBuddyResponse;
