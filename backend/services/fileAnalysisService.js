
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

const MAX_TEXT_LENGTH = 500000; // 5 lakh characters per document
const MAX_IMAGES = 3;

const analyzeUploadedFiles = async (files = []) => {
  const attachments = [];
  const imageParts = [];
  const extractedSections = [];

  if (!Array.isArray(files)) {
    throw new Error("Invalid uploaded files.");
  }

  for (const file of files) {
    attachments.push({
      name: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });

    // Process images
    if (file.mimetype.startsWith("image/")) {
      if (imageParts.length >= MAX_IMAGES) {
        throw new Error(
          "You can upload a maximum of 3 images per message."
        );
      }

      const base64Image = file.buffer.toString("base64");

      imageParts.push({
        type: "image_url",
        image_url: {
          url: `data:${file.mimetype};base64,${base64Image}`,
        },
      });

      continue;
    }

    let extractedText = "";

    // Extract text from documents
    try {
      switch (file.mimetype) {
        case "application/pdf": {
          const result = await pdfParse(file.buffer);
          extractedText = result.text;
          break;
        }

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
          const result = await mammoth.extractRawText({
            buffer: file.buffer,
          });

          extractedText = result.value;
          break;
        }

        case "text/plain":
        case "text/csv": {
          extractedText = file.buffer.toString("utf8");
          break;
        }

        default:
          throw new Error(
            `Unsupported file: ${file.originalname}`
          );
      }
    } catch (error) {
      throw new Error(
        `Could not read ${file.originalname}: ${error.message}`
      );
    }

    // Check readable content
    if (!extractedText.trim()) {
      throw new Error(
        `${file.originalname} does not contain readable text.`
      );
    }

    // Validate each document separately (5 lakh characters)
    if (extractedText.length > MAX_TEXT_LENGTH) {
      throw new Error(
        `${file.originalname} exceeds the 5 lakh (500,000 characters) limit. Please upload a smaller file.`
      );
    }

    extractedSections.push(
      `FILE: ${file.originalname}\n${extractedText}`
    );
  }

  // Combine validated document content
  const extractedText = extractedSections.join("\n\n");

  return {
    attachments,
    imageParts,
    extractedText,
  };
};

export default analyzeUploadedFiles;
