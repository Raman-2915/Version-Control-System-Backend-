const fs = require("fs").promises;
const path = require("path");
// const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Ignore .apnaGit, node_modules, .env
    if (
      entry.name === ".apnaGit" ||
      entry.name === "node_modules" ||
      entry.name === ".env"
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function commitRepo(message) {
  if (!message) {
    console.log("Commit message is required.");
    return;
  }
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  // Check if repo exists
  try {
    await fs.access(repoPath);
  } catch {
    console.log("Not an apnaGit repository. Please run init first.");
    return;
  }
  const commitsPath = path.join(repoPath, "commits");
  const headPath = path.join(repoPath, "HEAD.json");
  const logPath = path.join(repoPath, "log.json");
  const projectRoot = path.resolve(repoPath, "..");

  try {
    // const commitId = uuidv4();
    const commitId = crypto.randomUUID();
    const commitDir = path.join(commitsPath, commitId);
    const snapshotDir = path.join(commitDir, "snapshot");

    await copyDirectory(projectRoot, snapshotDir);

    const commitData = {
      id: commitId,
      message,
      date: new Date().toISOString(),
    };

    let logs = [];
    try {
      const existing = await fs.readFile(logPath, "utf-8");
      logs = JSON.parse(existing);
    } catch {}

    logs.push(commitData);
    await fs.writeFile(logPath, JSON.stringify(logs, null, 2));

    await fs.writeFile(
      headPath,
      JSON.stringify({ currentCommit: commitId }, null, 2),
    );

    console.log(`Commit ${commitId} created (full snapshot).`);
  } catch (err) {
    console.error("Error committing snapshot:", err.message);
  }
}

module.exports = { commitRepo };
