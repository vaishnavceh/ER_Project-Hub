import { Router } from "express";

import { pullRequestStatus, uploadProject } from "../controllers/projectController.js";
import { projectUpload } from "../middleware/upload.js";

const router = Router();

router.post("/upload", projectUpload, uploadProject);
router.get("/pull-requests/:number/status", pullRequestStatus);

export default router;
