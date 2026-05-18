const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Activity = require("../models/activityModel");

async function createRepository(req, res) {
  const { owner, name, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
    });

    const repo = await newRepository.save();
   
    await Activity.create({
  user: owner,
  type: "CREATE_REPO",
  repository: repo._id,
  message: `Created repository ${repo.name}`,
});
const io = req.app.get("io");

io.emit("activity", {
  message: `New repository created: ${repo.name}`,
});

    await User.findByIdAndUpdate(owner, {
      $push: { repositories: repo._id },
    });

    res.status(201).json({
      message: "Repository created successfully",
      repository: repo,
    });
  } catch (err) {
    console.error("Repository creation error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find()
      .populate("owner", "username email")
      .populate("issues");

    res.json(repositories);
  } catch (err) {
    console.error("Error fetching repositories:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getRepositoryById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id)
      .populate("owner", "username email")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    res.json(repository);
  } catch (err) {
    console.error("Error fetching repository:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getRepositoryByName(req, res) {
  const { name } = req.params;

  try {
    const repositories = await Repository.find({ name })
      .populate("owner", "username email")
      .populate("issues");

    res.json(repositories);
  } catch (err) {
    console.error("Error fetching repository:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getRepositoryForCurrentUser(req, res) {
  const userId = req.params.userID;

  try {
    const repositories = await Repository.find({ owner: userId });

    if (!repositories.length) {
      return res.status(404).json({ message: "No repositories found" });
    }

    res.json(repositories);
  } catch (err) {
    console.error("Error fetching user repositories:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    repository.visibility = !repository.visibility;

    await repository.save();

    res.json({
      message: "Repository visibility updated",
      repository,
    });
  } catch (err) {
    console.error("Error toggling visibility:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    if (content) repository.content.push(content);
    if (description) repository.description = description;

    await repository.save();

    res.json({
      message: "Repository updated successfully",
      repository,
    });
  } catch (err) {
    console.error("Error updating repository:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findByIdAndDelete(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }

    res.json({ message: "Repository deleted successfully" });
  } catch (err) {
    console.error("Error deleting repository:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}
async function toggleStarRepository(req, res) {
  const { id } = req.params; // repository id
  const userId = req.user; // from authMiddleware

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const alreadyStarred = repository.stars.includes(userId);

    if (alreadyStarred) {
      repository.stars.pull(userId);

      await User.findByIdAndUpdate(userId, {
        $pull: { starRepos: id },
      });

      await repository.save();
      await Activity.create({
  user: userId,
  type: "STAR_REPO",
  repository: id,
  message: "Starred a repository",
});

const io = req.app.get("io");
const onlineUsers = req.app.get("onlineUsers");

const repoOwnerId = repository.owner.toString();
const socketId = onlineUsers.get(repoOwnerId);

const notificationData = {

  message:
    "Someone starred your repository",

  repository:
    repository.name,

  starredBy:
    userId,

};

console.log(`
==================================
REALTIME SOCKET EVENT TRIGGERED
==================================

Repository : ${repository.name}

Starred By : ${userId}

Socket ID : ${socketId || "No active socket"}

==================================
`);

console.log(
  "Notification Data:",
  notificationData
);

// Emit only if socket exists
if (socketId) {

  io.to(socketId).emit(
    "notification",
    notificationData
  );
}


      return res.json({ message: "Repository unstarred" });
    }

    repository.stars.push(userId);

    await User.findByIdAndUpdate(userId, {
      $push: { starRepos: id },
    });

    await repository.save();

    res.json({ message: "Repository starred successfully" });
  } catch (err) {
    console.error("Error starring repository:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function commitToRepository(req, res) {
  const { id } = req.params;
  const { message, content } = req.body;

  try {
    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const newCommit = {
      message,
      content,
    };

    repo.commitHistory.push(newCommit);

    // optional: update latest content
    if (content) repo.content.push(content);

    await repo.save();
    await Activity.create({
  user: req.user,
  type: "COMMIT",
  repository: id,
  message: message,
});
   const io = req.app.get("io");

io.emit("activity", {
  message: `New commit: ${message}`,
});

    res.json({
      message: "Commit added successfully",
      commit: newCommit,
    });

  } catch (err) {
    console.error("Commit error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getCommitHistory(req, res) {
  const { id } = req.params;

  try {
    const repo = await Repository.findById(id).select("commitHistory");

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json(repo.commitHistory);

  } catch (err) {
    console.error("Error fetching commits:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getActivityFeed(req, res) {
  try {
    const activities = await Activity.find()
      .populate("user", "username")
      .populate("repository", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(activities);

  } catch (err) {
    console.error("Error fetching activity feed:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}


module.exports = {
  createRepository,
  getAllRepositories,
  getRepositoryByName,
  getRepositoryForCurrentUser,
  toggleVisibilityById,
  updateRepositoryById,
  deleteRepositoryById,
  getRepositoryById,
  toggleStarRepository,
  commitToRepository,
  getCommitHistory,
  getActivityFeed,
};
