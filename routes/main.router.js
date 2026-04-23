const express = require("express");

const userRouter = require("./user.router");
const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router");

const mainRouter = express.Router();

mainRouter.get("/", (req, res) => {
  res.send("VCS Backend Running ");
});

mainRouter.use("/api/users", userRouter);
mainRouter.use("/api/repos", repoRouter);
mainRouter.use("/api/issues", issueRouter);



module.exports = mainRouter;
