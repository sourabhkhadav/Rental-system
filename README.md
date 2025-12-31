# 🚗 Car Rental System

A comprehensive car rental platform built with React, Node.js, Express, and MongoDB. This system allows users to rent cars, owners to list their vehicles, and admins to manage the entire platform.

## 🌟 Features

### 🔐 Authentication & Security
- Email + Password registration/login
- JWT-based authentication
- Role-based access control (User, Owner, Admin)
- Password hashing with bcrypt
- Account status management (Pending, Approved, Rejected, Blocked)

### 👤 User Features
- Browse and search cars with filters
- Book cars for specific dates
- View booking history and status
- Rate and review cars/owners
- Profile management with KYC documents

### 🚙 Owner Features
- Add, edit, and manage car listings
- Handle booking requests (Accept/Reject)
- View earnings and booking analytics
- Upload car documents (RC, Insurance)
- Dashboard with comprehensive statistics

### 🛡️ Admin Features
- Approve/reject user and owner registrations
- Approve/reject car listings
- Block/unblock users and cars
- View platform statistics and analytics
- Manage all bookings and resolve disputes

### 🔍 Advanced Search
- Filter by location, dates, price range
- Filter by car specifications (seats, fuel type, transmission)
- Real-time availability checking
- Rating-based sorting

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image storage (optional)

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📁 Project Structure

```
car-rental-system/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configurations:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Admin Config
ADMIN_EMAIL=admin@carrental.com
ADMIN_PASSWORD=admin123
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 Database Models

### User Model
- Personal information (name, email, phone)
- Role-based access (user, owner, admin)
- KYC documents (driving license, Aadhar)
- Bank details for owners
- Status management and ratings

### Car Model
- Car specifications (brand, model, seats, fuel type)
- Pricing and availability
- Location and pickup details
- Documents (RC, insurance)
- Images and features
- Blocked dates for bookings

### Booking Model
- User and car references
- Date range and pricing
- Status flow (pending → accepted → confirmed → completed)
- Payment tracking
- Reviews and ratings
- Cancellation management

## 🔄 Booking Flow

1. **User searches** for cars with filters
2. **User selects** a car and dates
3. **Booking request** sent to car owner
4. **Owner accepts/rejects** the request
5. **System blocks** dates if accepted
6. **Booking confirmed** and ready for pickup
7. **Trip completed** and reviews exchanged

## 👨‍💼 Admin Panel Features

- **Dashboard** with key metrics and statistics
- **User Management** - approve, reject, block users
- **Car Management** - approve, reject car listings
- **Booking Management** - view, cancel, resolve disputes
- **Reports** - earnings, activity logs, fraud detection

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based route protection
- File upload validation
- Input sanitization and validation
- Rate limiting (can be added)
- CORS configuration

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive navigation and layouts
- Touch-friendly interface
- Optimized for all screen sizes

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or serve with backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Future Enhancements

- Payment gateway integration
- Real-time chat between users and owners
- GPS tracking and navigation
- Mobile app development
- Advanced analytics and reporting
- Multi-language support
- Push notifications

---

**Happy Coding! 🚗💨**