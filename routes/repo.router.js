const express = require("express");
const repoController = require("../controllers/repoController");
const authMiddleware = require("../middlewares/authMiddleware");

const repoRouter = express.Router();

// create repository
repoRouter.post("/", authMiddleware, repoController.createRepository);

// get all repositories
repoRouter.get("/", repoController.getAllRepositories);

// get repositories for a specific user
repoRouter.get("/user/:userID", repoController.getRepositoryForCurrentUser);


// get repository by name
repoRouter.get("/name/:name", repoController.getRepositoryByName);

repoRouter.get("/activity/feed", repoController.getActivityFeed);
repoRouter.post("/:id/commit", authMiddleware, repoController.commitToRepository);
repoRouter.get("/:id/commits", repoController.getCommitHistory);

// toggle star repository
repoRouter.patch(
  "/:id/star",
  authMiddleware,
  repoController.toggleStarRepository,
);
// toggle visibility
repoRouter.patch(
  "/:id/visibility",
  authMiddleware,
  repoController.toggleVisibilityById,
);



// update repository
repoRouter.put("/:id", authMiddleware, repoController.updateRepositoryById);

// delete repository
repoRouter.delete("/:id", authMiddleware, repoController.deleteRepositoryById);


// get repository by id
repoRouter.get("/:id", repoController.getRepositoryById);


module.exports = repoRouter;
