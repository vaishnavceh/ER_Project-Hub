import multer from "multer";

import { HttpError } from "../services/httpError.js";

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "File too large. Please upload smaller files or use a Google Drive report link for large reports."
        : "File upload failed. Please check the selected files and try again.";

    res.status(400).json({ error: message });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error?.message?.includes("GitHub")) {
    res.status(502).json({ error: error.message });
    return;
  }

  res.status(500).json({
    error: error?.message || "Something went wrong while processing the upload."
  });
}
