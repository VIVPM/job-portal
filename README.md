# 💼 Job Portal

A MERN stack job portal. Supports two user roles: **Applicants** and **Recruiters**, with persistent login sessions and JWT-secured REST APIs.

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend (React)"]
        Auth["Login / Register (Role Select)"]
        subgraph ApplicantViews["Applicant Views"]
            JobSearch["Job Search + Fuzzy Filter"]
            Applications["My Applications"]
            ApplicantProfile["Profile + Resume Upload"]
        end
        subgraph RecruiterViews["Recruiter Views"]
            PostJob["Post / Edit / Delete Jobs"]
            ManageApps["Manage Applications"]
            RecruiterProfile["Recruiter Profile"]
        end
    end

    subgraph NodeBackend["Node.js Backend (Express)"]
        AuthAPI["/auth — Login, Register, JWT"]
        MainAPI["/api — Jobs, Applications, Profile"]
        UploadAPI["/upload — Resume & Photo Upload"]
        DownloadAPI["/host — File Serving"]
    end


    subgraph Services["Services"]
        MongoDB[("MongoDB")]
        Cloudinary["Cloudinary\n(Profile Photos)"]
        LocalFS["Local File System\n(Resumes)"]
    end

    Frontend -->|JWT REST| NodeBackend
    AuthAPI --> MongoDB
    MainAPI --> MongoDB
    UploadAPI --> Cloudinary
    UploadAPI --> LocalFS
    DownloadAPI --> LocalFS
```

---

## ✨ Features

### 👤 Applicant Features
- **Job Search** — Browse jobs with fuzzy search and filters (type, salary, duration, skills)
- **Apply for Jobs** — Submit application with a Statement of Purpose (SOP)
- **Application Tracking** — View status of all submitted applications
- **Resume Upload** — Upload and manage resume (PDF)
- **Profile Photo** — Upload profile picture (Cloudinary)

### 🏢 Recruiter Features
- **Post Jobs** — Create job listings with title, description, type, salary, skills, duration
- **Manage Applications** — View all applicants, shortlist, accept, or reject applications
- **View Resumes** — Download and review applicant resumes
- **Profile Management** — Update recruiter profile and company info

### 🔐 Authentication
- Role-based registration: **Applicant** or **Recruiter**
- JWT token authentication (`jsonwebtoken` + Passport.js)
- Password hashing with `bcrypt`
- Persistent login sessions

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React (CRA) | UI framework |
| Material UI | Component library |
| React Router | Client-side routing |
| Axios | HTTP client |

### Node.js Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Mongoose + MongoDB | Database ORM + storage |
| Passport.js + JWT | Authentication |
| bcrypt | Password hashing |
| multer | File upload (resumes) |
| Cloudinary | Profile photo storage |
| nodemailer | Email support |



## 📁 Project Structure

```
job-portal-internship/
├── backend/
│   ├── routes/
│   │   ├── authRoutes.js      # Login, register, JWT
│   │   ├── apiRoutes.js       # Jobs, applications, profile CRUD
│   │   ├── uploadRoutes.js    # Resume & photo upload
│   │   └── downloadRoutes.js  # File serving
│   ├── db/                    # Mongoose models
│   ├── lib/                   # Passport config, helpers
│   └── server.js              # Express app entry point (port 4444)
├── frontend/
│   └── src/
│       ├── component/         # Applicant-specific views
│       ├── components/        # Recruiter & shared views
│       ├── context/           # Auth context
│       ├── lib/               # API helpers
│       └── App.js             # Routes & role-based rendering
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16+ + Yarn
- [Python](https://www.python.org/) v3.9+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Node.js Backend (Port 4444)

```bash
cd backend
yarn install
```

Create `.env` in `backend/`:
```env
mongo_url=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
port=4444
```

```bash
yarn dev    # development
yarn start  # production
```



### Frontend (Port 3000)

```bash
cd frontend
yarn install
yarn start
```

---

## 🔌 API Endpoints Overview

### Node.js Server (`http://localhost:4444`)

| Route Prefix | Description |
|---|---|
| `/auth` | Register (applicant/recruiter), login, JWT |
| `/api` | Jobs CRUD, applications, profile management |
| `/upload` | Resume PDF and profile photo upload |
| `/host` | Serve uploaded files (resumes, photos) |



---

## 📄 License

MIT License — see [LICENSE](LICENSE)
