import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import multer from "multer";

import { HttpError } from "../services/httpError.js";
import { safeUploadFileName, validateUploadFileName } from "../services/validation.js";

const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const maxSizeMb = Number(process.env.MAX_UPLOAD_FILE_SIZE_MB || 25);
const maxFileSize = maxSizeMb * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${safeUploadFileName(file.originalname)}`;
    cb(null, uniqueName);
  }
});

export const projectUpload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
    files: 51
  },
  fileFilter: (_req, file, cb) => {
    const errorMessage = validateUploadFileName(file.originalname, file.fieldname);
    if (errorMessage) {
      cb(new HttpError(400, errorMessage));
      return;
    }

    cb(null, true);
  }
}).fields([
  { name: "projectFiles", maxCount: 50 },
  { name: "reportPdf", maxCount: 1 }
]);
