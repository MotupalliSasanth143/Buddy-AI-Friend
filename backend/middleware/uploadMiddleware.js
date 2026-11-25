
import multer from "multer";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },

  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new Error(
          "Unsupported file type. Upload images, PDF, DOCX, TXT or CSV files."
        )
      );
    }

    callback(null, true);
  },
});

const uploadChatFiles = (req, res, next) => {
  upload.array("files", 5)(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Each file must be smaller than 10 MB."
            : error.code === "LIMIT_FILE_COUNT"
              ? "You can upload a maximum of 5 files."
              : error.message || "File upload failed.",
      });
    }

    next();
  });
};

export default uploadChatFiles;
