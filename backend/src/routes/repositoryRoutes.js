import { Router } from "express";

import { repositoryFiles } from "../controllers/repositoryController.js";

const router = Router();

router.get("/files", repositoryFiles);

export default router;
