const fs = require("fs").promises;
const path = require("path");

async function statusRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const logPath = path.join(repoPath, "log.json");
  const headPath = path.join(repoPath, "HEAD.json");

  try {
    // Check repository exists
    try {
      await fs.access(repoPath);
    } catch {
      console.log("Not an apnaGit repository. Run init first.");
      return;
    }

    // Read commits
    let logs = [];
    try {
      const logData = await fs.readFile(logPath, "utf-8");
      logs = JSON.parse(logData);
    } catch {}

    // Read HEAD
    let head = null;
    try {
      const headData = await fs.readFile(headPath, "utf-8");
      head = JSON.parse(headData);
    } catch {}

    console.log("\n======= Repository Status =======\n");

    console.log("Repository : Initialized");

    if (head && head.currentCommit) {
      console.log("Current HEAD :", head.currentCommit);
    } else {
      console.log("Current HEAD : None");
    }

    console.log("Total commits :", logs.length);

    if (logs.length > 0) {
      const lastCommit = logs[logs.length - 1];
      console.log("Last commit message :", lastCommit.message);
    }

    console.log("\n=================================\n");
  } catch (err) {
    console.error("Error reading repository status:", err.message);
  }
}

module.exports = { statusRepo };
