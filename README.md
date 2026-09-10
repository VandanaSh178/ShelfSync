# 📚 ShelfSync — Library Management System

A full-stack Library Management System built with the MERN Stack. ShelfSync goes beyond a basic CRUD app — it features secure authentication, role-based authorization, OTP verification, a book issuing system, and automation, making it a real-world level project.

---

## 🚀 Live Demo

> https://shelf-sync-1.vercel.app/

---

## 🎯 Features

- ✅ **User Authentication** — Secure Login & Signup using JWT (JSON Web Token)
- ✅ **Role-Based Authorization** — Admin & Member access levels
- ✅ **OTP Verification** — Secure account verification via Email using NodeMailer
- ✅ **Forgot & Reset Password** — Secure password recovery system
- ✅ **CRUD Operations** — Add, Edit, Delete, and Fetch Books with MongoDB
- ✅ **Book Issuing & Returning System** — Track borrowed books efficiently
- ✅ **Admin Panel** — Manage books & users with full control
- ✅ **Real-Time Notifications** — Send email updates for issued/overdue books
- ✅ **Data Security** — Hashed passwords, protected routes, unauthorized access prevention
- ✅ **Automation** — Automatically remove unverified accounts & send overdue reminders
- ✅ **RESTful APIs** — Clean and structured API design with Express.js
- ✅ **Responsive UI** — Fully functional frontend with Tailwind CSS
- ✅ **State Management** — Efficient state management with Redux Toolkit

---

## 🔥 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS |
| State Management | Redux Toolkit, React-Redux |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, Bcrypt.js |
| Email / OTP | NodeMailer |
| File Uploads | Cloudinary, Express-FileUpload |
| Automation | Node-Cron |

---

## 📁 Project Structure

```
ShelfSync/
├── client/                   # React Frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # BookManagement, UserDashboard, etc.
│   │   ├── layout/           # Sidebar, Header
│   │   ├── pages/            # Home, Login, Register
│   │   ├── popups/           # AddBook, RecordBook, ReadBook, etc.
│   │   ├── services/         # Axios API config
│   │   └── store/            # Redux slices and store
│
└── server/                   # Node.js Backend
    ├── controllers/          # Auth, Book, Borrow, User controllers
    ├── database/             # MongoDB connection
    ├── middlewares/          # Auth, Error, CatchAsync middlewares
    ├── models/               # User, Book, Borrow models
    ├── routes/               # API route definitions
    ├── services/             # Cron jobs (notify, cleanup)
    └── utils/                # Email sender, fine calculator
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- SMTP email credentials (for NodeMailer)

### 1. Clone the Repository

```bash
git clone https://github.com/VandanaSh178/ShelfSync.git
cd ShelfSync
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `config/config.env` file:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/shelfsync
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLIENT_NAME=your_cloud_name
CLOUDINARY_CLIENT_API=your_api_key
CLOUDINARY_CLIENT_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

Start the backend:

```bash
node server.js
```

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔗 API Endpoints

### Auth Routes `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/otp-verification` | Verify OTP |
| POST | `/login` | Login user |
| GET | `/logout` | Logout user |
| GET | `/me` | Get logged in user |
| POST | `/forgot-password` | Send reset password email |
| PUT | `/reset-password/:token` | Reset password |
| PUT | `/update-password` | Update password |

### Book Routes `/api/books`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all books |
| POST | `/add` | Add new book (Admin) |
| PUT | `/:id` | Update book (Admin) |
| DELETE | `/:id` | Delete book (Admin) |

### Borrow Routes `/api/borrow`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/borrow` | Borrow a book |
| PUT | `/return/:borrowId` | Return a book |
| GET | `/my-borrows` | Get active borrows |
| GET | `/borrow-history` | Get borrow history |
| GET | `/overdue` | Get overdue books (Admin) |
| GET | `/stats` | Get borrow stats (Admin) |

### User Routes `/api/users`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/all` | Get all users (Admin) |
| DELETE | `/:id` | Delete user (Admin) |

---

## 🤖 Automation (Cron Jobs)

| Job | Schedule | Description |
|---|---|---|
| Overdue Notifier | Every 30 minutes | Emails users with books due within 24 hours |
| Unverified Account Cleanup | Every hour | Removes unverified accounts older than 24 hours |

---

## 🔐 Role-Based Access

| Feature | User | Admin |
|---|---|---|
| Browse Books | ✅ | ✅ |
| Borrow / Return Books | ✅ | ✅ |
| View Own Borrow History | ✅ | ✅ |
| Add / Edit / Delete Books | ❌ | ✅ |
| View All Users | ❌ | ✅ |
| View Overdue Books | ❌ | ✅ |
| View Borrow Stats | ❌ | ✅ |
| Add New Admin | ❌ | ✅ |

---


## 🙌 Acknowledgements

Built as part of a full-stack MERN tutorial covering authentication, authorization, automation, and real-world API design.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
