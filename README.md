# Hostel Leave Management System

A full-stack web application for managing student hostel leave requests, built with the PERN/MERN stack (approximated here as MERN: MongoDB, Express, React, Node).

## 🚀 Features

### Student Portal
- **Login/Register**: Secure account creation.
- **Apply for Leave**: Submit leave requests with reason and dates.
- **Track Status**: View history of requests with status (Pending, Approved, Rejected) and comments.

### Warden (Admin) Portal
- **Dashboard**: View all student leave requests.
- **Manage Requests**: Approve or reject leaves.
- **Comments**: Add optional comments when reviewing requests.

## 🛠 Technology Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## 📦 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on default port 27017)

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/hostel-app
# JWT_SECRET=your_secret_key
npm start
```
Server runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`.

## 📝 Usage Guide

1. **Register User**:
   - Go to `/register`.
   - Select role "Student" to apply for leaves.
   - Select role "Warden" to manage leaves.

2. **Student Workflow**:
   - Login.
   - Fill out the leave form.
   - View status in "My Leave History".

3. **Warden Workflow**:
   - Login.
   - See list of pending leaves.
   - Click "Approve" or "Reject".

## 🔒 Security
- Passwords are hashed using `bcryptjs`.
- Routes are protected via JWT middleware.
