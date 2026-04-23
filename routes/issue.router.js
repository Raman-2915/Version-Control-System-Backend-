const express = require("express");
const issueController = require("../controllers/issueController");
const authMiddleware = require("../middlewares/authMiddleware");

const issueRouter = express.Router();

/* ---------- CREATE ISSUE ---------- */

// create issue inside a repository
issueRouter.post("/repo/:repoId", authMiddleware, issueController.createIssue);

/* ---------- GET ISSUES ---------- */

// get all issues of a repository
issueRouter.get("/repo/:repoId", issueController.getAllIssues);

/* ---------- UPDATE / DELETE ISSUE ---------- */

// update issue
issueRouter.put(
  "/repo/:repoId/:id",
  authMiddleware,
  issueController.updateIssueById
);

// delete issue
issueRouter.delete(
  "/repo/:repoId/:id",
  authMiddleware,
  issueController.deleteIssueById
);

/* ---------- GET SINGLE ISSUE (KEEP LAST) ---------- */

issueRouter.get("/repo/:repoId/:id", issueController.getIssueById);

module.exports = issueRouter;