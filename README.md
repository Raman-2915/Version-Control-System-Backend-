# ApnaGit Backend 🚀

ApnaGit is a developer platform backend that combines a custom CLI-based version control system with a collaborative repository platform.

It provides repository management, commit history tracking, issue tracking, social interactions (follow, star), and an activity feed with real-time notifications.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io (Real-time notifications)

---

## Features

### Authentication
- User signup
- User login
- JWT-based authentication

### User System
- User profile management
- Follow / unfollow users
- View following users

### Repository System
- Create repositories
- Update repository description
- Toggle repository visibility
- Delete repositories

### Commit System
- Add commits to repositories
- Store commit history
- View repository commits

### Issue Tracking
- Create issues for repositories
- Update issues
- Delete issues
- Track issue status (open / closed)

### Social Features
- Star / unstar repositories
- Follow other users

### Activity Feed
Tracks actions like:
- Repository creation
- Repository starring
- Commits
- Issue creation

### Real-Time Notifications
Repository owners receive notifications when someone stars their repository.
# ApnaGit Backend 🚀

ApnaGit is a developer platform backend that combines a custom CLI-based version control system with a collaborative repository platform.

It provides repository management, commit history tracking, issue tracking, social interactions (follow, star), and an activity feed with real-time notifications.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io (Real-time notifications)

---

## Features

### Authentication
- User signup
- User login
- JWT-based authentication

### User System
- User profile management
- Follow / unfollow users
- View following users

### Repository System
- Create repositories
- Update repository description
- Toggle repository visibility
- Delete repositories

### Commit System
- Add commits to repositories
- Store commit history
- View repository commits

### Issue Tracking
- Create issues for repositories
- Update issues
- Delete issues
- Track issue status (open / closed)

### Social Features
- Star / unstar repositories
- Follow other users

### Activity Feed
Tracks actions like:
- Repository creation
- Repository starring
- Commits
- Issue creation

### Real-Time Notifications
Repository owners receive notifications when someone stars their repository.

---

## Project Structure
apnaGit-backend
│
├── controllers
│ ├── userController.js
│ ├── repoController.js
│ └── issueController.js
│
├── models
│ ├── userModel.js
│ ├── repoModel.js
│ ├── issueModel.js
│ └── activityModel.js
│
├── routes
│ ├── user.router.js
│ ├── repo.router.js
│ ├── issue.router.js
│ └── main.router.js
│
├── middlewares
│ └── authMiddleware.js
│
├── server.js
└── package.jsonapnaGit-backend
│
├── controllers
│ ├── userController.js
│ ├── repoController.js
│ └── issueController.js
│
├── models
│ ├── userModel.js
│ ├── repoModel.js
│ ├── issueModel.js
│ └── activityModel.js
│
├── routes
│ ├── user.router.js
│ ├── repo.router.js
│ ├── issue.router.js
│ └── main.router.js
│
├── middlewares
│ └── authMiddleware.js
│
├── server.js
└── package.json

---

## API Overview

### Authentication

POST /api/users/signup  
POST /api/users/login  

### Users

GET /api/users  
GET /api/users/:id  
PUT /api/users/:id  
DELETE /api/users/:id  
PATCH /api/users/:id/follow  
GET /api/users/:id/following  

### Repositories

POST /api/repos/create  
GET /api/repos/all  
GET /api/repos/:id  
GET /api/repos/name/:name  
GET /api/repos/user/:userID  
PUT /api/repos/:id  
DELETE /api/repos/:id  
PATCH /api/repos/:id/visibility  
PATCH /api/repos/:id/star  
POST /api/repos/:id/commit  
GET /api/repos/:id/commits  
GET /api/repos/activity/feed  

### Issues

POST /api/issues/:repoId/create  
GET /api/issues/repo/:repoId  
GET /api/issues/:repoId/:id  
PUT /api/issues/repoId/:id  
DELETE /api/issues/repoId/:id  

---

## Installation

Clone the repository

git clone https://github.com/Raman-2915/apnaGit-backend.git

Navigate to project folder

cd apnaGit-backend

Install dependencies

npm install

Start server

npm start

---

## Environment Variables

Create a `.env` file

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

---

## Future Improvements

- Pull request system
- Repository forks
- Branch management
- File tree structure for commits
- Code diff visualization

---

## Author

Developed as a backend engineering project to explore version control concepts, collaborative repositories, and real-time backend systems.

## Project Structure

