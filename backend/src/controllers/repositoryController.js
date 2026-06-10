import { listRepositoryFiles } from "../services/githubService.js";

export async function repositoryFiles(req, res, next) {
  try {
    const result = await listRepositoryFiles(req.query.path || "");
    res.json(result);
  } catch (error) {
    next(error);
  }
}
