const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const userRouter = express.Router();


userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:id", authMiddleware, userController.getUserProfile);

userRouter.put(
  "/:id",
  authMiddleware,
  userController.updateUserProfile,
);

userRouter.delete(
  "/:id",
  authMiddleware,
  userController.deleteUserProfile,
);
userRouter.patch(
  "/:id/follow",
  authMiddleware,
  userController.toggleFollowUser,
);

userRouter.get("/:id/following", userController.getFollowingUsers);

module.exports = userRouter;
