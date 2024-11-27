# Wellness Coach Management System

A comprehensive system for managing wellness coaches and their clients, featuring session scheduling, progress tracking, and analytics.

## Features

- 🔐 Role-based authentication (Admin, Coach)
- 👥 Client management
- 📅 Session scheduling with email notifications
- 📊 Analytics dashboard
- 📈 Progress tracking
- ✉️ Automated email reminders

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer
- Express Validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Gmail account (for email notifications)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wellness-coach-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/wellnessz
JWT_SECRET=your_jwt_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Role-Based Access Control

The system implements role-based access control (RBAC) using JWT tokens and middleware authentication.

### Roles and Permissions

1. **Admin**
   - Create/manage coaches
   - View all clients
   - Access analytics dashboard
   - Schedule sessions
   - Delete clients

2. **Coach**
   - View assigned clients
   - Update client progress
   - Schedule sessions
   - Track client metrics

### Implementation Details

- Authentication is handled via JWT tokens
- Role verification middleware (`authenticateTo`)
- Role-specific route protection
- Hierarchical permission structure

# API Documentation

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "coach"  // "admin" or "coach"
}

Response (200 OK):
{
    "status": 200,
    "message": "User registered successfully",
    "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "role": "coach"
    }
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}

Response (200 OK):
{
    "status": 200,
    "token": "jwt_token_here",
    "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "role": "coach"
    }
}
``` 

### Get All Users
```http
GET /api/auth/users
Authorization: Bearer <token>
Access: Admin Only

Response (200 OK):
{
    "status": 200,
    "users": [
        {
            "name": "John Doe",
            "email": "john@example.com",
            "role": "coach"
        }
    ]
}
```

## Client Management Endpoints

### Create Client
```http
POST /api/clients
Authorization: Bearer <token>
Access: Admin, Coach
Content-Type: application/json

{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "1234567890",
    "age": 30,
    "goal": "Weight loss",
    "coachId": "coach_id_here"
}

Response (201 Created):
{
    "status": 201,
    "message": "Client created successfully",
    "client": {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "1234567890",
        "age": 30,
        "goal": "Weight loss",
        "coachId": "coach_id_here"
    }
}
```
### Get All Clients
```http
GET /api/clients
Authorization: Bearer <token>
Access: Admin, Coach

Response (200 OK):
{
    "status": 200,
    "clients": [
        {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "phone": "1234567890",
            "age": 30,
            "goal": "Weight loss",
            "coachId": "coach_id_here"
        }
    ]
}
```
### Update Client Progress
```http
PATCH /api/clients/:id/progress
Authorization: Bearer <token>
Access: Coach Only
Content-Type: application/json

{
    "progress": "Making good progress with diet plan",
    "weight": 65.5,
    "bmi": 22.5
}

Response (200 OK):
{
    "status": 200,
    "message": "Client details updated successfully",
    "updateClientDetails": {
        "progress": "Making good progress with diet plan",
        "weight": 65.5,
        "bmi": 22.5,
        "lastUpdated": "2024-03-15T10:30:00.000Z"
    }
}
```
### Delete Client
```http
DELETE /api/clients/:id
Authorization: Bearer <token>
Access: Admin Only

Response (200 OK):
{
    "status": 200,
    "message": "Client deleted successfully"
}
```

### Schedule Follow-up Session
```http
POST /api/clients/:id/schedule
Authorization: Bearer <token>
Access: Admin, Coach
Content-Type: application/json

{
    "date": "2024-03-20",
    "time": "14:00",
    "sessionType": "Consultation"  // "Consultation" or "Follow-up"
}

Response (200 OK):
{
    "status": 200,
    "message": "Follow-up session scheduled successfully",
    "session": {
        "date": "2024-03-20",
        "time": "14:00",
        "sessionType": "Consultation",
        "status": "scheduled"
    }
}
```

## Coach Management Endpoints

### Create Coach
```http
POST /api/coaches
Authorization: Bearer <token>
Access: Admin Only
Content-Type: application/json

{
    "name": "Coach Smith",
    "email": "coach@example.com",
    "specialization": "Weight Training",
    "experience": "5 years"
}

Response (201 Created):
{
    "status": 201,
    "message": "Coach created successfully",
    "coach": {
        "name": "Coach Smith",
        "email": "coach@example.com",
        "specialization": "Weight Training",
        "experience": "5 years"
    }
}
```

### Get All Coaches
```http
GET /api/coaches
Authorization: Bearer <token>
Access: Admin Only

Response (200 OK):
{
    "status": 200,
    "coaches": [
        {
            "name": "Coach Smith",
            "email": "coach@example.com",
            "specialization": "Weight Training",
            "experience": "5 years"
        }
    ]
}
```
### Get Coach's Clients
```http
GET /api/coaches/:coachId/clients
Authorization: Bearer <token>
Access: Admin, Coach (own clients only)

Response (200 OK):
{
    "status": 200,
    "clients": [
        {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "progress": "Making good progress",
            "lastUpdated": "2024-03-15T10:30:00.000Z"
        }
    ]
}
```

## Analytics Endpoints

### Get Admin Dashboard
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
Access: Admin Only

Response (200 OK):
{
    "status": 200,
    "data": {
        "totalClients": 50,
        "activeClients": 30,
        "coachStats": {
            "totalCoaches": 5,
            "averageClientsPerCoach": "10.00"
        },
        "progressTrends": [
            {
                "date": "2024-03-01",
                "averageWeight": "68.50"
            }
        ],
        "lastUpdated": "2024-03-15T12:00:00.000Z"
    }
}
```





## Testing

1. **Authentication Testing**
   ```bash
   # Register a new coach
   curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{
     "name": "Test Coach",
     "email": "coach@test.com",
     "password": "password123",
     "role": "coach"
   }'
   ```

2. **Client Management Testing**
   ```bash
   # Create a new client
   curl -X POST http://localhost:5000/api/clients -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{
     "name": "Test Client",
     "email": "client@test.com",
     "goal": "Weight loss"
   }'
   ```

## Error Handling

The system implements comprehensive error handling:

- Input validation using express-validator
- Custom error classes for operational errors
- Environment-specific error responses
- Detailed validation error messages

## Email Notifications

The system uses Nodemailer for email notifications:

- Session scheduling confirmations
- 24-hour session reminders
- Requires Gmail account with App Password

## Security Measures

1. Password Hashing
2. JWT Authentication
3. Input Sanitization
4. Role-Based Access Control
5. Environment Variable Protection

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details