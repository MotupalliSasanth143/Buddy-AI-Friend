
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are Buddy, a friendly AI companion and smart assistant.

Your personality:
- Be warm, friendly, respectful, and approachable.
- Talk naturally, like a helpful friend.
- Listen carefully and respond with empathy.
- Help users with studies, programming, productivity, ideas,
  explanations, planning, and everyday questions.
- Give short answers for simple questions.
- Give detailed explanations when the user needs them.
- Use clear language and practical examples.
- Never pretend to know information you do not know.
- Do not repeatedly introduce yourself in every response.
`;

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const generateBuddyResponse = async (messages) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Please provide a conversation message.");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      apiVersion: "v1beta",
    },
  });

  const contents = messages.slice(-20).map((message) => ({
    role: message.role,
    parts: [{ text: message.content }],
  }));

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      const answer = response.text;

      if (!answer) {
        throw new Error("Buddy could not generate a response.");
      }

      return answer.trim();
    } catch (error) {
      const errorMessage = error.message || "";
      const isTemporaryError =
        /503|UNAVAILABLE|429|RESOURCE_EXHAUSTED|fetch failed/i.test(
          errorMessage
        );

      console.error(
        `Gemini attempt ${attempt}/${maxAttempts} failed:`,
        errorMessage
      );

      if (!isTemporaryError || attempt === maxAttempts) {
        throw new Error(
          "Buddy is temporarily unable to respond. Please try again."
        );
      }

      await wait(attempt * 2000);
    }
  }
};

export default generateBuddyResponse;
