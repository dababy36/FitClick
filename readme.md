# Click Fit - User Management System

A modern web application for managing users and handling file uploads with a clean, responsive interface.

## Features

### 1. Theme Toggle
- Dynamic light/dark mode switching
- Theme preference persistence across sessions
- Smooth transition animations
- Accessible theme toggle button

### 2. User Management
- Add new users with form validation
  - Name validation
  - Email format validation
  - Password security with bcrypt hashing
- View all users in a responsive table
  - User name
  - Email address
  - User type
  - Account status
- Real-time form validation feedback
- Duplicate email detection

### 3. File Upload System
- Drag and drop file upload interface
- Multiple file upload support
- Image file type validation
- Visual feedback during upload
- Progress animations
- Browse button alternative

### 4. Historical Facts Feature
- Random historical facts from Numbers API
- Dynamic fact loading
- Navigation controls
- Year display
- Loading state handling


## Technical Stack

### Frontend
- HTML5
- CSS3 with modern features
- jQuery for DOM manipulation
- AJAX for API calls
- Responsive design principles

### Backend
- Node.js
- Express.js framework
- MySQL database
- bcrypt for password hashing
- CORS support
- File upload handling

### Database
- MySQL
- Docker



## Setup Instructions

1. Clone the repository
2. Run npm install
3. Run docker-compose up
4. Run npm start
5. Open the browser and go to http://localhost:3000
