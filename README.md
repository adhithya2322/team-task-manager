# Team Task Manager (Full-Stack)

## Live Demo

Frontend:
https://team-task-manager-oztv-git-main-adhithya-s-projects.vercel.app/

Backend:
https://team-task-manager-production-997b.up.railway.app

---

# Project Overview

Team Task Manager is a full-stack MERN application where users can create projects, assign tasks, and track progress with role-based access.

---

# Features

## Authentication
- Register
- Login
- Logout

## Admin
- Create Project
- Delete Project
- Create Tasks
- Assign Members
- Delete Tasks

## Member
- View Assigned Tasks
- Update Task Status

## Dashboard
- Pending Tasks Count
- Completed Tasks Count
- In Progress Tasks Count
- Overdue Tasks Count

---

# Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM
- Vite

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcryptjs

## Deployment
- Vercel
- Railway

---

# Installation

## Frontend B

cd frontend
npm install
npm run dev

## Backend Setup

cd backend
npm install
npm start

# Folder Structure

team-task-manager/
│
├── frontend/
├── backend/
└── README.md

# API Endpoints
 
## Authentication

POST /api/auth/register
POST /api/auth/login

## Projects

GET /api/projects
POST /api/projects
DELETE /api/projects/:id

## Tasks

GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

# Future Improvements

Drag and Drop Tasks
Email Notifications
Dark Mode
Team Chat
File Upload Support

# Author

Adhithya Gunti
