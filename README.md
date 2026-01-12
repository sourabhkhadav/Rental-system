# Car Rental System

A full-stack car rental application built with React.js and Node.js.

## Features

- **User Authentication**: Login/Register for Users, Owners, and Admin
- **Car Management**: Add, edit, and manage car listings
- **Booking System**: Book cars, manage bookings, accept/reject requests
- **Admin Panel**: Manage users, cars, and bookings
- **Role-based Access**: Different dashboards for Users, Owners, and Admin

## Quick Start

1. **Prerequisites**
   - Node.js (v14 or higher)
   - MongoDB (running on localhost:27017)

2. **Installation & Start**
   ```bash
   # Simply run the start script
   start.bat
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5005
   - Admin Login: admin@gmail.com / admin123

## User Roles

### Admin
- **Login**: admin@gmail.com / admin123
- **Features**: Manage all users, cars, and bookings

### Car Owner
- **Registration**: Sign up with role "owner"
- **Features**: Add cars, manage bookings, view earnings

### Regular User
- **Registration**: Sign up with role "user"
- **Features**: Search and book cars, manage bookings

## Project Structure

```
Rental-system/
├── backend/                 # Node.js API server
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & upload middleware
│   └── server.js          # Main server file
├── frontend/              # React.js application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   └── services/      # API services
│   └── public/
└── start.bat             # Quick start script
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Cars
- GET `/api/cars` - Get all cars
- POST `/api/cars` - Add new car (Owner only)
- GET `/api/cars/my-cars` - Get owner's cars

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/user-bookings` - Get user bookings
- GET `/api/bookings/owner-bookings` - Get owner bookings

### Admin
- GET `/api/admin/users` - Get all users
- GET `/api/admin/cars` - Get all cars
- GET `/api/admin/bookings` - Get all bookings

## Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create `.env` file in backend directory:
```
PORT=5005
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123
```

## Default Admin Account

- **Email**: admin@gmail.com
- **Password**: admin123

The admin account is automatically created when the server starts.

## Technologies Used

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer (File uploads)
- bcryptjs (Password hashing)

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- React Hot Toast

## License

This project is for educational purposes.