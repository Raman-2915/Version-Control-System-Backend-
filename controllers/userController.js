const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function signup(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      userId: user._id,
    });

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      userId: user._id,
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getUserProfile(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .select("-password")
      .populate("repositories");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateUserProfile(req, res) {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    let updateFields = {};

    if (email) updateFields.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);

  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteUserProfile(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}
async function toggleFollowUser(req, res) {
  const targetUserId = req.params.id; // user to follow
  const currentUserId = req.user; // logged-in user (from auth middleware)

  try {
    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(currentUserId);

    const alreadyFollowing = currentUser.followedUsers.includes(targetUserId);

    if (alreadyFollowing) {
      currentUser.followedUsers.pull(targetUserId);
      await currentUser.save();

      return res.json({ message: "User unfollowed successfully" });
    }

    currentUser.followedUsers.push(targetUserId);
    await currentUser.save();

    res.json({ message: "User followed successfully" });
  } catch (err) {
    console.error("Follow user error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}
async function getFollowingUsers(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .populate("followedUsers", "username email")
      .select("followedUsers");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.followedUsers);
  } catch (err) {
    console.error("Error fetching following users:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  toggleFollowUser,
  getFollowingUsers,
};