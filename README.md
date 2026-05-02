# 🚀 LeadFlow CRM

A full-stack CRM web application for managing client leads generated from website contact forms. Built with **React + Vite**, **Node.js + Express**, and **MySQL**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Admin Auth | JWT-based login with protected routes |
| 📋 Lead Management | Add, edit, delete, and view leads |
| 🔍 Search & Filter | Search by name/email/company, filter by status |
| 📊 Dashboard | Summary cards for total, new, contacted, and converted leads |
| 📝 Notes | Add multiple time-stamped notes per lead |
| 📅 Follow-ups | Schedule follow-up reminders and mark as complete |
| 📱 Responsive | Mobile-friendly layout with collapsible sidebar |

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite 5, React Router v6
- **Backend**: Node.js + Express 4
- **Database**: MySQL 8 (with `mysql2` driver + connection pooling)
- **Auth**: JWT (`jsonwebtoken`) + `bcrypt` password hashing
- **Styling**: Plain CSS with CSS variables, Google Fonts (Sora + DM Mono)

---

## 📁 Project Structure

```
leadflow-crm/
├── backend/                 # Express API
│   ├── config/db.js         # MySQL pool
│   ├── controllers/         # Business logic
│   ├── middleware/auth.js   # JWT guard
│   ├── routes/              # API routes
│   ├── server.js            # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── api/axios.js     # Axios instance
│   │   ├── components/      # Shared UI components
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Login, Dashboard, Leads, LeadDetail
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
└── database/
    └── schema.sql           # MySQL tables + seed admin
```

---

## ⚡ Quick Start

### 1. Prerequisites

- Node.js ≥ 18
- MySQL 8 running locally
- Git

### 2. Clone the repo

```bash
git clone https://github.com/your-username/leadflow-crm.git
cd leadflow-crm
```

### 3. Set up the database

Log in to MySQL and run:

```bash
mysql -u root -p < database/schema.sql
```

This creates the `leadflow_crm` database, all tables, and a default admin user.

### 4. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=leadflow_crm
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 5. Install backend dependencies & run

```bash
cd backend
npm install
npm run dev       # uses nodemon for hot-reload
# or
npm start         # production
```

Backend runs on `http://localhost:5000`

### 6. Configure the frontend

```bash
cd frontend
cp .env.example .env
```

`.env` content (default, no changes needed for local dev with Vite proxy):

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Install frontend dependencies & run

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔑 Default Admin Login

| Field | Value |
|---|---|
| Email | `admin@leadflow.com` |
| Password | `admin123` |

> **⚠️ Important**: Change the default password in production. You can update it with a bcrypt hash directly in MySQL.

---

## 🔌 API Reference

All routes except `POST /api/auth/login` require an `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current admin |

### Leads
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leads` | List leads (supports `?status=`, `?search=`, `?sort=`) |
| GET | `/api/leads/stats` | Dashboard stats |
| GET | `/api/leads/:id` | Single lead with notes & follow-ups |
| POST | `/api/leads` | Create lead |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |

### Notes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/leads/:leadId/notes` | Add note to lead |
| DELETE | `/api/notes/:id` | Delete note |

### Follow-ups
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/leads/:leadId/followups` | Create follow-up |
| PATCH | `/api/followups/:id/complete` | Mark as completed |
| DELETE | `/api/followups/:id` | Delete follow-up |

---

## 📸 Screenshots

> _Add screenshots here after running the app locally._
> 
> - `screenshots/login.png`
> - `screenshots/dashboard.png`
> - `screenshots/leads.png`
> - `screenshots/lead-detail.png`

---

## 🧑‍💻 Development Tips

- **Hot reload**: Both `npm run dev` commands support hot reload out of the box.
- **Vite proxy**: The frontend Vite dev server proxies `/api` requests to `http://localhost:5000`, so no CORS issues in development.
- **Production build**: Run `npm run build` in the frontend folder and serve the `dist/` directory via your backend or a CDN.

---

## 🗺️ Roadmap

- [ ] Email notifications for new leads
- [ ] CSV export
- [ ] Role-based access (multi-user)
- [ ] Pipeline / Kanban view
- [ ] Activity log

---

## 📄 License

MIT — free to use for personal and commercial projects.

