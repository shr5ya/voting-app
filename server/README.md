# Electra API Server

This is the backend server for the Electra voting application, providing secure APIs for election management, voting, user authentication, and real-time notifications.

## Features

- **Secure Authentication**: JWT-based authentication with role-based access control
- **Admin APIs**: Comprehensive election management, user management, and statistics
- **Voter APIs**: Election viewing, secure voting, and results access
- **Real-time Notifications**: Socket.io integration for instant updates
- **Scheduled Tasks**: Automated election reminders and notifications
- **Email Integration**: Configurable email templates for various notifications

## API Routes

### Admin Routes

- `/api/v1/admin/elections` - Election management (CRUD)
- `/api/v1/admin/users` - User management
- `/api/v1/admin/stats` - Statistics and reporting
- `/api/v1/admin/config` - System configuration

### Voter Routes

- `/api/v1/voter/elections` - List available elections
- `/api/v1/voter/elections/:id` - View election details
- `/api/v1/voter/elections/:id/vote` - Cast a vote
- `/api/v1/voter/elections/:id/results` - View election results
- `/api/v1/voter/history/votes` - View voting history

### Authentication Routes

- `/api/v1/auth/login` - User login
- `/api/v1/auth/register` - User registration
- `/api/v1/auth/verify` - Email verification
- `/api/v1/auth/refresh` - Refresh token
- `/api/v1/auth/reset-password` - Password reset

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/electra.git
   cd electra/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration values.

4. Start the development server:
   ```
   npm run dev
   ```

### Building for Production

```
npm run build
npm start
```

## Project Structure

```
src/
├── api/
│   ├── routes/
│   │   ├── admin/            # Admin API routes
│   │   ├── voter/            # Voter API routes
│   │   └── index.ts          # Route registration
├── middleware/
│   ├── auth.ts               # Authentication middleware
│   └── validation.ts         # Request validation
├── services/
│   ├── notification/         # Notification service
│   └── email/                # Email service
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
└── server.ts                 # Main server entry point
```

## Security Features

- JWT for secure authentication
- Rate limiting to prevent brute force attacks
- Helmet for HTTP header security
- CORS protection
- Input validation
- Role-based access control

## Notification System

The server includes a comprehensive notification system:

- Email notifications using Nodemailer
- In-app real-time notifications via Socket.io
- Scheduled notifications and reminders
- Customizable notification templates

## License

MIT 