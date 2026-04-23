const fs = require("fs").promises;
const path = require("path");

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function pushRepo() {
  const projectRoot = process.cwd();
  const localRepoPath = path.join(projectRoot, ".apnaGit");
  const localCommitsPath = path.join(localRepoPath, "commits");

  const remoteBasePath = path.join(projectRoot, "remote");
  const remoteRepoPath = path.join(remoteBasePath, ".apnaGit");
  const remoteCommitsPath = path.join(remoteRepoPath, "commits");

  try {
    // 1️⃣ Check if repo initialized
    try {
      await fs.access(localRepoPath);
    } catch {
      console.log("Not an apnaGit repository. Please run init first.");
      return;
    }

    // 2️⃣ Check if commits exist
    const commitDirs = await fs.readdir(localCommitsPath);
    if (commitDirs.length === 0) {
      console.log("No commits to push.");
      return;
    }

    await fs.mkdir(remoteCommitsPath, { recursive: true });

    let pushedCount = 0;

    for (const commitDir of commitDirs) {
      const localCommitPath = path.join(localCommitsPath, commitDir);
      const remoteCommitPath = path.join(remoteCommitsPath, commitDir);

      // Skip if already exists remotely
      try {
        await fs.access(remoteCommitPath);
        continue;
      } catch {
        await copyDirectory(localCommitPath, remoteCommitPath);
        pushedCount++;
      }
    }

    // 3️⃣ Copy HEAD and log
    await copyDirectory(localRepoPath, remoteRepoPath);

    if (pushedCount === 0) {
      console.log("Nothing new to push.");
    } else {
      console.log(`${pushedCount} commit(s) pushed successfully.`);
    }
  } catch (err) {
    console.error("Error pushing to remote:", err.message);
  }
}

module.exports = { pushRepo };
