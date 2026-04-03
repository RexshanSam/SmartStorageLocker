# LockVault — Smart Storage Locker Management System

A full-stack web application for managing storage lockers with reservation capabilities, built with Django REST Framework backend and React frontend.

![LockVault Dashboard](https://via.placeholder.com/1200x600/1e293b/3b82f6?text=LockVault+Dashboard)

## Features

- **User Authentication**: JWT-based authentication with admin and user roles
- **Locker Management**: Create, read, update, delete lockers (admin only)
- **Reservation System**: Reserve lockers with time slots, release, and auto-expire
- **Role-Based Access**: Separate views for users and admins
- **Responsive Design**: Modern dark theme with glassmorphism effects
- **Real-time Updates**: Countdown timers for active reservations
- **Auto-expiration**: Reservations automatically expire based on time
- **Comprehensive API**: RESTful API with Swagger documentation
- **Production-Ready**: Proper error handling, validation, and security

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Environment Variables](#environment-variables)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [API Endpoints](#api-endpoints)
8. [Default Credentials](#default-credentials)
9. [Running the Application](#running-the-application)
10. [Development Notes](#development-notes)

---

## Tech Stack

### Backend
- Django 5.1.6
- Django REST Framework 3.15.2
- SimpleJWT 5.3.1 (JWT authentication)
- MySQL (database)
- drf-spectacular 0.27.2 (OpenAPI/Swagger docs)
- django-cors-headers 4.4.0 (CORS support)

### Frontend
- React 18.3.1
- Vite 5.4.10 (build tool)
- React Router v6 6.28.0 (routing)
- Axios 1.7.7 (HTTP client)
- Tailwind CSS 3.4.14 (styling)
- react-hot-toast 2.4.1 (notifications)
- date-fns 3.6.0 (date utilities)

---

## Prerequisites

Before running this project, ensure you have:

- **Python 3.10+** installed
- **Node.js 18+** and npm/yarn installed
- **MySQL 8.0+** server running locally
- **Git** (optional, for version control)

---

## Project Structure

```
lockvault/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── users/
│   │   │   ├── models.py (Custom User model)
│   │   │   ├── serializers.py (Auth serializers)
│   │   │   ├── views.py (Auth endpoints)
│   │   │   ├── urls.py
│   │   │   ├── permissions.py (IsAdminRole)
│   │   │   └── admin.py
│   │   ├── lockers/
│   │   │   ├── models.py (Locker model)
│   │   │   ├── serializers.py
│   │   │   ├── views.py (Locker ViewSet)
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   └── reservations/
│   │       ├── models.py (Reservation + signals)
│   │       ├── serializers.py (validated booking)
│   │       ├── views.py (reservation views)
│   │       ├── urls.py
│   │       └── admin.py
│   └── management/
│       └── commands/
│           └── seed_lockers.py (sample data)
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js (proxy config)
    ├── tailwind.config.js (custom theme)
    ├── postcss.config.js
    ├── .env
    └── src/
        ├── main.jsx (entry point)
        ├── App.jsx (routing)
        ├── index.css (global styles)
        ├── api/
        │   ├── axiosInstance.js (interceptors)
        │   ├── authAPI.js
        │   ├── lockerAPI.js
        │   └── reservationAPI.js
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
        │   ├── useAuth.js
        │   └── useLockers.js
        ├── routes/
        │   ├── ProtectedRoute.jsx
        │   └── AdminRoute.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── LockerCard.jsx
        │   ├── ReservationCard.jsx
        │   ├── StatusBadge.jsx
        │   ├── Modal.jsx
        │   ├── Loader.jsx
        │   ├── StatCard.jsx
        │   └── CountdownTimer.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── DashboardPage.jsx
            ├── LockersPage.jsx
            ├── LockerDetailPage.jsx
            ├── MyReservationsPage.jsx
            ├── admin/
            │   ├── AdminLockersPage.jsx
            │   └── AdminReservationsPage.jsx
            └── NotFoundPage.jsx
```

---

## Environment Variables

### Backend (.env in backend/)

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (MySQL)
DB_ENGINE=django.db.backends.mysql
DB_NAME=lockvault
DB_USER=root
DB_PASSWORD=root
DB_HOST=localhost
DB_PORT=3306

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (.env in frontend/)

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Backend Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE lockvault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Set up Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
# Copy the example env file
copy .env.example .env
# Edit .env with your MySQL credentials and SECRET_KEY
```

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional: create admin user
```

### 6. Seed Sample Data

```bash
python manage.py seed_lockers
```

This creates 20 lockers across 4 locations with small/medium/large sizes.

### 7. Run the Server

```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/`

Access Swagger API documentation at: `http://localhost:8000/api/docs/`

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env
# Ensure VITE_API_URL points to your backend (default is localhost:8000)
```

### 3. Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173/`

---

## API Endpoints

All endpoints are prefixed with `/api/`

### Authentication

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/register/` | No | `{name, email, password, password_confirm, role}` | Register new user |
| POST | `/auth/login/` | No | `{email, password}` | Login, returns JWT tokens |
| POST | `/auth/refresh/` | No | `{refresh}` | Refresh access token |
| GET | `/auth/me/` | Yes | - | Get current user profile |

### Lockers

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| GET | `/lockers/` | Yes (optional) | Query: `status`, `size` | List lockers (filterable) |
| POST | `/lockers/` | Yes (Admin only) | `{locker_number, location, size, status}` | Create locker |
| GET | `/lockers/<id>/` | Yes (optional) | - | Get locker detail |
| PUT | `/lockers/<id>/` | Yes (Admin only) | Same as POST | Update locker |
| DELETE | `/lockers/<id>/` | Yes (Admin only) | - | Delete locker |

### Reservations

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| GET | `/reservations/` | Yes | - | List reservations (Admin=all, User=own) |
| GET | `/reservations/<id>/` | Yes | - | Get reservation detail |
| POST | `/reservations/create/` | Yes (User only) | `{locker, reserved_from, reserved_until}` | Create reservation |
| PUT | `/reservations/<id>/release/` | Yes (owner or admin) | `{reason}` | Release reservation |

### Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/docs/` | Swagger UI documentation |
| GET | `/api/schema/` | OpenAPI schema (JSON) |

---

## Default Test Credentials

### Admin Account
After creating a superuser:
- Email: admin@lockvault.com
- Password: [your chosen password]
- Role: admin

### Regular User
You can register a new user with:
- Role: user
- Access to browse lockers and make reservations

---

## Running the Application

### Production Build (Frontend)

```bash
cd frontend
npm run build
```

Build artifacts will be created in `dist/` directory.

### Development Setup

Start both servers in separate terminals:

```bash
# Terminal 1: Backend (port 8000)
cd backend
python manage.py runserver

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

The frontend Vite dev server proxies `/api` requests to `http://localhost:8000`.

---

## Development Notes

### Security

- JWT tokens are stored in localStorage (consider HttpOnly cookies in production)
- SimpleJWT tokens have 15-minute access, 1-day refresh lifetimes
- CORS configured to allow only frontend origin
- CSRF protection enabled (for session auth fallback)
- Admin-only endpoints protected by custom `IsAdminRole` permission

### Reservation Logic

- Lockers can only be reserved if status is `available`
- Double-booking prevented with database-level unique constraint and overlapping query
- When a reservation is created, the locker status automatically changes to `reserved`
- On release/expire, locker status returns to `available` (if no other active reservations)
- Reservations can be released by owner or admin
- Auto-expiration via Django signals (post_save checks if past `reserved_until`)

### Database

Default: MySQL 8.0+ (configured via environment variables)

To switch to SQLite (development only):
- Set `DB_ENGINE=django.db.backends.sqlite3`
- Set `DB_NAME=db.sqlite3`

### Tailwind CSS

Custom colors defined in `tailwind.config.js`:
- Primary: `navy` palette (navy-950 as background)
- Accent: `electric-blue` (#3b82f6)
- Status colors: success (green), error (red), warning (yellow)

Glassmorphism utility class:
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## License

This project is open source and available under the MIT License.

---

## Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ using Django + React**
