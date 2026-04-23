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

async function pullRepo() {
  const projectRoot = process.cwd();

  const localRepoPath = path.join(projectRoot, ".apnaGit");
  const localCommitsPath = path.join(localRepoPath, "commits");

  const remoteBasePath = path.join(projectRoot, "remote");
  const remoteRepoPath = path.join(remoteBasePath, ".apnaGit");
  const remoteCommitsPath = path.join(remoteRepoPath, "commits");

  try {
    // 1️⃣ Check local repo
    try {
      await fs.access(localRepoPath);
    } catch {
      console.log("Not an apnaGit repository. Please run init first.");
      return;
    }

    // 2️⃣ Check remote exists
    try {
      await fs.access(remoteCommitsPath);
    } catch {
      console.log("Remote repository not found.");
      return;
    }

    const remoteCommitDirs = await fs.readdir(remoteCommitsPath);

    if (remoteCommitDirs.length === 0) {
      console.log("Nothing to pull.");
      return;
    }

    let pulledCount = 0;

    for (const commitDir of remoteCommitDirs) {
      const remoteCommitPath = path.join(remoteCommitsPath, commitDir);
      const localCommitPath = path.join(localCommitsPath, commitDir);

      try {
        await fs.access(localCommitPath);
        continue; // already exists
      } catch {
        await copyDirectory(remoteCommitPath, localCommitPath);
        pulledCount++;
      }
    }

    // 3️⃣ Copy HEAD and log
    await copyDirectory(remoteRepoPath, localRepoPath);

    if (pulledCount === 0) {
      console.log("Already up to date.");
    } else {
      console.log(`${pulledCount} commit(s) pulled successfully.`);
    }
  } catch (err) {
    console.error("Error pulling from remote:", err.message);
  }
}

module.exports = { pullRepo };
