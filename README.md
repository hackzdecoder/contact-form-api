Contact Portal
A full-stack CRUD web application used to manage and store contact information. This project includes a React (Vite) frontend and a Node.js + Express + MySQL backend, structured using best practices and the MVC architecture pattern.


Project Overview
Purpose:
This application is designed to manage contact submissions from users or clients. It provides a simple and secure interface to create, view, update, and delete contact entries, such as names and contact info.

Tech Stack
Frontend (located in /app)
React (Vite)

React Router DOM

Material UI

Backend (located in /api)
Node.js

Express.js

MySQL

Sequelize (ORM)

dotenv (for environment configuration)

Developer Tools
nodemon (for automatic server restart during development)



Project Structure


project-test/
├── app/             # Frontend (React)
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── ...
├── api/             # Backend (Node.js + Express + MySQL)
│   ├── config/       # Database connection setup
│   ├── controllers/  # Business logic
│   ├── routes/       # API routes
│   ├── models/       # Sequelize models
│   ├── middleware/   # Error handling and other middleware
│   ├── migrations/   # Database migrations (optional)
│   ├── seeders/      # Initial data seeding (optional)
│   ├── .env          # Environment variables
│   ├── app.js        # Entry point for backend
│   ├── package.json
└── README.md
Key Features
Full CRUD (Create, Read, Update, Delete) functionality for contact records

Form validation (both client and server side)

Responsive UI using Material UI

RESTful API design

Clean separation of concerns using MVC architecture

Installation and Setup Instructions
Prerequisites
Node.js installed

MySQL installed and running

npm or yarn package manager

(Optional) XAMPP if you prefer GUI for managing MySQL

Backend Setup (folder: api)
Create the MySQL database:


Open your MySQL CLI or phpMyAdmin and run:

sql

CREATE DATABASE prototype_db;
Configure environment variables:

Create a .env file inside the api/ directory with the following content:

ini

DB_NAME=prototype_db
DB_USER=root
DB_PASS=
DB_HOST=127.0.0.1

JWT_SECRET=anonymoususer
JWT_EXPIRES_IN=1h
Update DB_USER, DB_PASS, and DB_HOST as needed for your environment.

Install backend dependencies and run migrations:



bash

cd path/to/project/api
npm install
npx sequelize-cli db:migrate
npm run dev
This will start the backend server and connect to the database.

Frontend Setup (folder: app)
Install frontend dependencies and run:



bash

cd path/to/project/app
npm install
npm run dev
This will start the React development server at http://localhost:5173.

Summary
This is a complete full-stack contact management system demonstrating:

Modular architecture

Clean and organized folder structure

Proper use of Git and development tools

Secure coding practices using environment variables and input validation

Clear separation between backend (API) and frontend (UI)