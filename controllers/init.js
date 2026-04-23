const fs = require("fs").promises;
const path = require("path");
async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");
  const headPath = path.join(repoPath, "HEAD.json");
  const logPath = path.join(repoPath, "log.json");
  const configPath = path.join(repoPath, "config.json");

  try {
    try {
      await fs.access(repoPath);
      console.log("Repository already initialized.");
      return;
    } catch {}
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.writeFile(
      headPath,
      JSON.stringify({ currentCommit: null }, null, 2),
    );
    await fs.writeFile(logPath, JSON.stringify([], null, 2));
    await fs.writeFile(
      configPath,
      JSON.stringify({ initializedAt: new Date().toISOString() }, null, 2),
    );
    console.log("Repository initialised!");
  } catch (err) {
    console.error("Error initializing repository:", err.message);
  }
}
module.exports = { initRepo };
