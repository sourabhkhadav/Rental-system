# Car Rental System - Fixed Login

## Quick Start

1. **Run the system:**
   ```
   Double-click start.bat
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5005

## Login Credentials

### Admin Login
- **Email:** admin@gmail.com
- **Password:** admin123

### Test User (if needed)
You can register a new user or use the admin credentials above.

## What Was Fixed

1. **Unified Login System:** Removed separate admin login page - all users (including admin) now use the same login page at `/login`

2. **Admin User Creation:** The system automatically creates an admin user with email `admin@gmail.com` and password `admin123` when the backend starts

3. **User Status:** All new users are now automatically approved, so they can login immediately after registration

4. **Routing:** Admin users are automatically redirected to `/admin/dashboard` after login

## How to Login as Admin

1. Go to http://localhost:3000/login
2. Enter email: admin@gmail.com
3. Enter password: admin123
4. Click "Sign In"
5. You will be automatically redirected to the admin dashboard

## Troubleshooting

If login still doesn't work:

1. **Check if backend is running:** Visit http://localhost:5005/api/health
2. **Reset admin user:** Run `node setup-admin.js` in the backend folder
3. **Check MongoDB:** Make sure MongoDB is running on your system

## File Changes Made

- ✅ Fixed admin user creation in `backend/server.js`
- ✅ Updated login routing in `frontend/src/pages/Login.jsx`
- ✅ Removed separate admin login route from `frontend/src/App.jsx`
- ✅ Set default user status to 'approved' in `backend/models/User.js`
- ✅ Updated registration controller in `backend/controllers/authController.js`
- ✅ Created admin setup script `backend/setup-admin.js`
- ✅ Updated startup script `start.bat`

The system now works with a single login page for all users, and admin@gmail.com can login successfully!