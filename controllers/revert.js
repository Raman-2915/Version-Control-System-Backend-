const fs = require("fs").promises;
const path = require("path");

async function deleteProjectFiles(projectRoot) {
  const entries = await fs.readdir(projectRoot, { withFileTypes: true });

  for (let entry of entries) {
    if (
      entry.name === ".apnaGit" ||
      entry.name === "node_modules" ||
      entry.name === ".env"
    ) {
      continue;
    }

    const fullPath = path.join(projectRoot, entry.name);

    if (entry.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.unlink(fullPath);
    }
  }
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");
  const logPath = path.join(repoPath, "log.json");
  const headPath = path.join(repoPath, "HEAD.json");
  const projectRoot = path.resolve(repoPath, "..");

  try {
    // 1️⃣ Check repo exists
    try {
      await fs.access(repoPath);
    } catch {
      console.log("Not an apnaGit repository. Run init first.");
      return;
    }

    // 2️⃣ Check log file exists
    let logs;
    try {
      const logData = await fs.readFile(logPath, "utf-8");
      logs = JSON.parse(logData);
    } catch {
      console.log("No commits found.");
      return;
    }

    // 3️⃣ Check commits exist
    if (!logs || logs.length === 0) {
      console.log("No commits available to revert.");
      return;
    }

    // 4️⃣ Validate commit ID
    const commitExists = logs.some((c) => c.id === commitID);
    if (!commitExists) {
      console.log("Invalid commit ID.");
      return;
    }

    const snapshotPath = path.join(commitsPath, commitID, "snapshot");

    // 5️⃣ Check snapshot exists
    try {
      await fs.access(snapshotPath);
    } catch {
      console.log("Snapshot data missing for this commit.");
      return;
    }

    // 6️⃣ Delete current project files
    await deleteProjectFiles(projectRoot);

    // 7️⃣ Restore snapshot
    await copyDirectory(snapshotPath, projectRoot);

    // 8️⃣ Update HEAD
    await fs.writeFile(
      headPath,
      JSON.stringify({ currentCommit: commitID }, null, 2),
    );

    console.log(`Successfully reverted to commit ${commitID}`);
  } catch (err) {
    console.error("Revert failed:", err.message);
  }
}

module.exports = { revertRepo };
