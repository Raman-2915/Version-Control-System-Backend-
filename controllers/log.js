const fs = require("fs").promises;
const path = require("path");

async function logRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const logPath = path.join(repoPath, "log.json");

  try {
    // Check if repository exists
    try {
      await fs.access(repoPath);
    } catch {
      console.log("Not an apnaGit repository. Run init first.");
      return;
    }

    // Read log file
    let logs;
    try {
      const logData = await fs.readFile(logPath, "utf-8");
      logs = JSON.parse(logData);
    } catch {
      console.log("No commits found.");
      return;
    }

    if (!logs.length) {
      console.log("No commits found.");
      return;
    }

    console.log("\n======= Commit History =======\n");

    // Show latest commit first
    for (let i = logs.length - 1; i >= 0; i--) {
      const commit = logs[i];

      console.log(`Commit ID : ${commit.id}`);
      console.log(`Message   : ${commit.message}`);
      console.log(`Date      : ${commit.date}`);
      console.log("------------------------------");
    }
  } catch (err) {
    console.error("Error reading commit log:", err.message);
  }
}

module.exports = { logRepo };
