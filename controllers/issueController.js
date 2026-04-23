const Issue = require("../models/issueModel");
const Repository = require("../models/repoModel");

async function createIssue(req, res) {
  const { title, description, repositoryId ,createdBy} = req.body;

  try {
    const repository = await Repository.findById(repositoryId);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const issue = new Issue({
      title,
      description,
      repository: repositoryId,
      createdBy,
    });

    await issue.save();

    repository.issues.push(issue._id);
    await repository.save();

    res.status(201).json(issue);

  } catch (err) {
    console.error("Error creating issue:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (status) issue.status = status;

    await issue.save();

    res.json(issue);

  } catch (err) {
    console.error("Error updating issue:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully" });

  } catch (err) {
    console.error("Error deleting issue:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getAllIssues(req, res) {
  const { repoId } = req.params;

  try {
    const issues = await Issue.find({ repository: repoId });

    if (!issues.length) {
      return res.status(404).json({ message: "No issues found" });
    }

    res.json(issues);

  } catch (err) {
    console.error("Error fetching issues:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);

  } catch (err) {
    console.error("Error fetching issue:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};