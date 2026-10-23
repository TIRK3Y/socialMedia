# MERN Social Feed and Task Manager

A full-stack MERN application that combines a simple social feed with a personal task manager. Users register and log in with JWT authentication, publish text posts with optional images, maintain a profile with a photo, and organise tasks by category. The back end is an Express 5 REST API backed by MongoDB; the front end is a Create React App project styled with Material UI.

## Features

- Sign-up and login with bcrypt password hashing and JWT tokens (1-day expiry)
- Protected API routes using a Bearer-token middleware
- Feed of posts from all users, newest first, with optional image upload (stored as base64 in MongoDB)
- User profile with name, phone, role, bio and profile photo upload
- Task manager with categories (Work, Personal, Urgent, Others), category filter, edit and completion status
- Light and dark theme toggle with Material UI theming
- Postman collection for exercising the API (`dashboard/server/routes/MERN-Dashboard-API-with-tests.postman_collection.json`)

## Tech stack

| Layer | Technology |
| --- | --- |
| Front end | React 19, React Router 7, Material UI 7, Axios, react-icons (Create React App / react-scripts 5) |
| Back end | Node.js, Express 5, Mongoose 8, jsonwebtoken, bcryptjs, Multer, dotenv, cors |
| Database | MongoDB |

## Getting started

### Prerequisites

- Node.js and npm
- A MongoDB instance (local or hosted)

### Environment variables

Copy `dashboard/server/.env.example` to `dashboard/server/.env` and set:

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign login tokens (required; use a long random string) |
| `PORT` | API port (optional, defaults to 5000) |

### Run the API

```bash
cd dashboard/server
npm install
npm run dev     # with nodemon
# or
npm start
```

### Run the client

```bash
cd dashboard/client
npm install
npm start
```

The client runs on http://localhost:3000 and calls the API at `http://localhost:5000`.

## API

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | No | Register a user |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| GET | `/api/user/profile` | Yes | Get the current user's profile |
| PUT | `/api/user/profile` | Yes | Update profile fields and photo (multipart) |
| GET | `/api/posts` | Yes | List all posts |
| POST | `/api/posts` | Yes | Create a post with an optional image (multipart) |
| GET | `/api/posts/user/:userId` | Yes | List posts by a user |
| GET | `/api/tasks` | Yes | List the current user's tasks |
| POST | `/api/tasks` | Yes | Create a task |
| PUT | `/api/tasks/:id` | Yes | Update a task |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |

## Project structure

```
dashboard/
  client/
    src/
      api/            Axios instances and task API helpers
      pages/          Login, Signup, Feed, Profile, TaskManager and shared navigation
      theme.js        Material UI light/dark theme
  server/
    server.js         Express app and MongoDB connection
    middleware/       JWT authentication middleware
    models/           User, Post and Task Mongoose models
    routes/           Auth, user, post and task routes
```

## Notes

- The Task Manager page currently stores tasks in the browser's `localStorage`; the task API endpoints exist on the server but are not yet used by that page.
- The feed UI includes edit and delete actions and a friends feed component whose corresponding API endpoints are not yet implemented on the server.

## License

No license has been specified for this project.
