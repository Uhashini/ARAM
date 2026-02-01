# IPV Intervention System

A comprehensive healthcare-integrated digital platform for intimate partner violence detection, assessment, and intervention support.

## Project Structure

```
ipv-intervention-system/
├── frontend/          # React.js frontend application
├── backend/           # Node.js/Express.js backend API
├── .kiro/            # Kiro specifications and documentation
└── package.json      # Root package.json for project management
```

## Technology Stack

- **Frontend**: React.js with React Router
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Security**: Helmet, CORS, Rate limiting
- **Testing**: Jest for backend, React Testing Library for frontend

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install:all
   ```

## Environment Configuration

1. Copy the example environment file in the backend:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Update the environment variables in `backend/.env`:
   - Set your MongoDB connection string
   - Configure JWT secrets for production
   - Adjust other settings as needed

## Development

### Start both frontend and backend:
```bash
npm run dev
```

### Start individually:
```bash
# Backend only (runs on port 5000)
npm run server

# Frontend only (runs on port 3000)
npm run client
```

## Testing

### Run all tests:
```bash
npm test
```

### Run tests individually:
```bash
# Backend tests
npm run test:server

# Frontend tests
npm run test:client
```

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/health` - Health check endpoint
- `POST /api/auth/*` - Authentication endpoints (to be implemented)
- `POST /api/witness/*` - Witness reporting endpoints (to be implemented)
- `POST /api/victim/*` - Victim/survivor endpoints (to be implemented)
- `GET /api/healthcare/*` - Healthcare worker endpoints (to be implemented)
- `GET /api/admin/*` - Administrator endpoints (to be implemented)

## User Roles

The system supports four user roles:

1. **Witnesses** - Anonymous incident reporting
2. **Victims/Survivors** - Self-screening, safety planning, journal tracking
3. **Healthcare Workers** - Patient screening, care plans, clinical tools
4. **Administrators** - System analytics, user management, content management

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting on API endpoints
- Security headers with Helmet
- Data encryption for sensitive information
- CORS protection

## Development Status

This project is currently in development. The core infrastructure has been set up as part of Task 1. Subsequent tasks will implement:

- Authentication system (Task 2)
- Database models and data security (Task 3)
- Witness reporting module (Task 4)
- Risk assessment engine (Task 6)
- Victim/survivor tools (Task 7)
- Healthcare worker tools (Task 8)
- Referral system (Task 9)
- Analytics and reporting (Task 12)

## Contributing

This project follows a structured development approach using Kiro specifications. Please refer to the task list in `.kiro/specs/ipv-intervention-system/tasks.md` for implementation priorities.

## License

This project is licensed under the ISC License.