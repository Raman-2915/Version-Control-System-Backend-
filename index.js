const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { statusRepo } = require("./controllers/status");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");
const { logRepo } = require("./controllers/log");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)
  .command("log", "Show commit history", {}, logRepo)
  .command("status", "Show repository status", {}, statusRepo)
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    },
  )
  .command("push", "Push commits ", {}, pushRepo)
  .command("pull", "Pull commits ", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Comit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    },
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors({ origin: "*" }));

  const mongoURI = process.env.MONGODB_URI;

  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.error("Unable to connect : ", err));

  app.use("/", mainRouter);

  //  CREATE HTTP SERVER
  const httpServer = http.createServer(app);

  //  SOCKET.IO SETUP
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  //  STORE ONLINE USERS
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // register user
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User registered:", userId);
    });
    socket.on(
  "notification",
  (data) => {

    console.log(`
Notification Received
`);

    console.log(data);
  }
);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // remove user from map
      for (let [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  //  MAKE SOCKET AVAILABLE IN CONTROLLERS
  app.set("io", io);
  app.set("onlineUsers", onlineUsers);

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations ready");
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
}