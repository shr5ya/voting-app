# Electra Voting System

A modern and secure online voting platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Electra allows organizations to create, manage, and run secure elections with real-time results visualization.

## Features

- **User Authentication**: Secure login for administrators and voters
- **Role-based Access**: Admin and Voter roles with specific permissions
- **Admin Dashboard**: Create and manage elections, candidates, and voters
- **Election Management**: Schedule elections with start/end dates and automatic status updates
- **Voter Interface**: Intuitive interface for casting votes with confirmation
- **Real-time Results**: Live results with data visualization using Recharts
- **Security**: Prevention of double voting and data persistence
- **MongoDB Integration**: Cloud-based data storage with MongoDB Atlas

## Tech Stack

### Frontend
- React.js with TypeScript
- Shadcn UI components
- React Router for navigation
- Context API for state management
- Recharts for data visualization

### Backend
- Node.js & Express.js with TypeScript
- MongoDB with Mongoose ODM
- JWT for authentication
- MongoDB Atlas for cloud database
- RESTful API architecture

## Project Structure

```
voting-app/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React context providers
│   ├── pages/              # Application pages
│   ├── layouts/            # Layout components
│   └── utils/              # Utility functions
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── api/            # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── config/         # Configuration
│   │   └── utils/          # Utility functions
│   └── server.ts           # Entry point
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- MongoDB Atlas account (free tier is sufficient)

### Installation

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd voting-app
   ```

2. **Setup environment variables**
   - Create a `.env` file in the server directory
   ```
   PORT=5002
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/electra-voting?retryWrites=true&w=majority
   ```

3. **Install dependencies**
   ```
   npm install
   cd server
   npm install
   ```

4. **Run the application**
   - For server:
   ```
   cd server
   npm run dev
   ```
   
   - For client:
   ```
   npm run dev
   ```
   
   Or use the concurrent script to run both:
   ```
   npm run dev:all
   ```

## MongoDB Atlas Integration

The application now uses MongoDB Atlas for data persistence. To set up your own MongoDB connection:

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user with password
4. Get your connection string and replace it in the `.env` file
5. The application will automatically create the necessary collections

## Data Models

### Election
- Title, description, start/end dates
- Status (draft, upcoming, active, completed)
- Candidates list with vote counts
- Voters tracking
- Results analytics

### Voter
- Name, email
- Voting status
- Election participation tracking
- Access code for security

## License
MIT
