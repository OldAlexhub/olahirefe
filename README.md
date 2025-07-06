# OlaHire Frontend

**OlaHire** is an AI-powered job matching platform built with React. It offers an ethical, contextual alternative to traditional applicant tracking systems. This frontend supports both applicant and recruiter workflows, complete with role-based access, AI integrations, and a responsive UI.

---

## 🚀 Project Highlights

### ✅ Applicant Features

- Secure login and signup
- Smart resume builder (with CRUD)
- Browse and filter job listings
- Contextual job matching powered by AI
- Apply to jobs and track submissions
- Personalized dashboard (`/myjobs`)

### 🧑‍💼 Admin/Recruiter Features

- Admin login and dashboard
- Post, view, and delete jobs
- View applicant list with AI match scores
- Drill-down into individual applicant profiles
- Run resume summarization and keyword extraction with AI

### 🤖 AI Capabilities

- Transformer-based resume-job comparison
- Contextual match scoring (`match_percent`)
- Resume summarization (`/summarize`)
- Keyword extraction (`/extractkeywords`)
- Admin-only AI tools embedded in applicant views

---

## 🛠 Tech Stack

- **React 18** + React Router 6
- **Axios** for API requests
- **Bootstrap 5** for UI
- **LocalStorage** for session/token persistence
- **Role-based routing** via `ProtectedRoute` and `AdminsOnly` wrappers
- **Environment config** via `.env`

---

## 🗂 Folder & Routing Structure

All routes are defined in `RouteManager.jsx` with two layers of protection:

- `ProtectedRoute` → for authenticated users
- `AdminsOnly` → for authenticated admins

### 🧭 Routes Overview

| Path                          | Access | Description                        |
| ----------------------------- | ------ | ---------------------------------- |
| `/`                           | Public | Home + login                       |
| `/signup`                     | Public | Signup form                        |
| `/admins`                     | Public | Admin login                        |
| `/jobs`                       | User   | Browse job listings                |
| `/jobs/:jobNumber`            | User   | View job detail                    |
| `/applynow/:jobNumber`        | User   | Resume preview + submission        |
| `/profile`                    | User   | Create or edit resume              |
| `/myjobs`                     | User   | List of applied jobs with match %  |
| `/adminpage`                  | Admin  | Admin dashboard                    |
| `/postajob`                   | Admin  | Post a new job                     |
| `/postedjobs`                 | Admin  | View/delete jobs                   |
| `/applied`                    | Admin  | View submitted applications        |
| `/applicantprofile/:userId`   | Admin  | AI-enhanced applicant profile view |
| `/adminjobdetails/:jobNumber` | Admin  | Job detail (placeholder)           |

---

## 🔐 Role-Based Auth

| Component        | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `ProtectedRoute` | Restricts access to authenticated users only |
| `AdminsOnly`     | Restricts access to admins with token        |
| `Layout.jsx`     | Shared layout + dynamic nav for roles        |

---

## 📦 Setup & Installation

1.  **Clone the repo**

    ```bash
    git clone https://github.com/OldAlexhub/olahirefe.git
    cd olahire-frontend
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Create .env file**

    ```ini
    REACT_APP_BASE_LINK=http://localhost:5000 # Node.js backend
    REACT_APP_BASE_PYTHON=http://localhost:8000 # Python AI microservice
    ```

4.  **Start development server**

    ```bash
    npm start
    ```

## 🧠 AI Features Powered By Python Backend

These features use transformer models (e.g., gtr-t5-base):

Endpoint | Method | Description
/summarize | POST | Summarizes an applicant’s profile
/extractkeywords | POST | Extracts keywords from resume content
/row-application | POST | Sends full structured resume for scoring

These are triggered via:

- ApplicantProfile.jsx (admin view)

- ApplyNow.jsx (submission)

## 👨‍💻 Author

**_Mohamed Gad_**

**_Portfolio | GitHub_**

**_AI/ML Engineer | Full-Stack Developer | Data Science Leader_**

## 📄 License

MIT License — free to use, extend, or modify.

OlaHire: Built for fairness. Driven by intelligence. Designed for the future of hiring.
