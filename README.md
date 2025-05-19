# MERN Online Voting System

A comprehensive online voting system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for secure and efficient election management.

## Features

- *User Authentication*: Secure registration and login with email verification
- *Role-based Access*: Admin and Voter roles with specific permissions
- *Admin Dashboard*: Create and manage elections, candidates, and view results
- *Voter Interface*: Participate in elections with an intuitive UI
- *Security*: JWT authentication, encryption, and prevention of double voting
- *Analytics*: Visualize election results and voter turnout

## Tech Stack

### Frontend
- React.js with hooks and functional components
- Material-UI for UI components
- Redux Toolkit for state management
- React Router for navigation
- Chart.js for data visualization

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Express Validator for input validation

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB (local or Atlas URI)

### Installation

1. *Clone the repository*
   
   git clone <repository-url>
   cd online-voting-system
   

2. *Setup environment variables*
   - Create a .env file in the server directory
   
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email_for_sending_verification
   EMAIL_PASS=your_email_password
   

3. *Install server dependencies*
   
   cd server
   npm install
   

4. *Install client dependencies*
   
   cd ../client
   npm install
   

5. *Run the application*
   - For server (from the server directory):
   
   npm run dev
   
   - For client (from the client directory):
   
   npm start
   

## Project Structure


online-voting-system/
├── client/                # React frontend
├── server/                # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── server.js          # Entry point
└── README.md


## License
MIT
