# Public Complaint & Civic Issue Tracking System

**Pandit Deendayal Energy University (PDEU)**  
**Department of Computer Science and Engineering — Semester 7 Minor Project (2026)**  
**Project Team:** Meet Patel & Aditya Jadeja  
**Evaluation Components:** Internal Assessment (30 Marks), Project Report (20 Marks), End-Semester Viva (50 Marks)

---

## 🏛️ Project Overview

The **Public Complaint & Civic Issue Tracking System (CivicPulse)** is a full-stack municipal governance web platform designed to bridge citizens, municipal administrative officers, and field operations crews. 

It provides an end-to-end digital lifecycle:
1. **Citizens** detect and file civic hazards with 1-click HTML5 GPS geotagging and photo evidence.
2. **Municipal Administrators** triage complaints, flag priorities, and route tickets to appropriate departments and field crews.
3. **Ground Field Crews** receive dispatched tickets, update on-site progress, and upload **Proof-of-Work photos** upon repair completion.
4. **Citizens** inspect the resolution photo, provide a 1–5 star rating with feedback, and sign off to close the ticket.

---

## 🛠️ Technology Stack

- **Frontend:**
  - React 18 (Vite)
  - Tailwind CSS
  - React Router DOM (v6)
  - Axios (HTTP client with JWT Bearer interceptor)
  - Lucide React (Icons)
  - Recharts (Interactive Municipal Analytics)
  - HTML5 Geolocation API (GPS Coordinate Capture)

- **Backend:**
  - Node.js & Express.js
  - MySQL / MariaDB (via `mysql2/promise` connection pool)
  - JSON Web Tokens (`jsonwebtoken`) for role-based authorization
  - `bcryptjs` for secure password hashing
  - `multer` for issue evidence and resolution proof image uploads

---

## 🔄 6-Stage Complaint Lifecycle State Transitions

```
[SUBMITTED]
    │  (Citizen logs grievance with GPS & photo; Ticket ID CIV-2026-XXXX generated)
    ▼
[UNDER REVIEW]
    │  (Admin reviews validity and jurisdiction)
    ▼
[ASSIGNED]
    │  (Admin routes to Department and specific Field Staff Officer)
    ▼
[IN PROGRESS]
    │  (Field staff arrives on site and initiates repair)
    ▼
[RESOLVED]
    │  (Field staff completes repair, uploads Proof-of-Work photo & remarks)
    ▼
[CLOSED]
       (Citizen inspects repair proof, leaves 1–5 star rating & feedback)
```

---

## 🔑 Demo Login Credentials

For quick evaluation during viva and presentation, use the pre-seeded demo accounts:

| Role | Name | Email | Password | Department |
| :--- | :--- | :--- | :--- | :--- |
| **Municipal Admin** | Municipal Admin | `admin@civic.gov` | `admin123` | All Departments / Triage |
| **Field Staff (Roads)** | Ramesh Kumar | `ramesh.staff@civic.gov` | `password123` | Road Maintenance |
| **Field Staff (Sanitation)** | Suresh Sharma | `suresh.staff@civic.gov` | `password123` | Sanitation |
| **Field Staff (Electrical)** | Vikram Patel | `vikram.staff@civic.gov` | `password123` | Electrical Department |
| **Citizen 1** | Meet Patel | `meet@student.pdpu.ac.in` | `password123` | Citizen Account |
| **Citizen 2** | Aditya Jadeja | `aditya@student.pdpu.ac.in` | `password123` | Citizen Account |
| **Citizen 3** | Priya Sharma | `priya@gmail.com` | `password123` | Citizen Account |

> **Tip:** The Login page includes **1-Click Demo Buttons** to instantly log in as Admin, Staff, or Citizen without typing credentials.

---

## 🗄️ Database Architecture (MySQL)

- **`departments`**: Predefined civic divisions (`Road Maintenance`, `Sanitation`, `Electrical Department`, `Water & Drainage`, `General Services`).
- **`users`**: Role-based authentication (`citizen`, `admin`, `staff`) with bcrypt hashes.
- **`complaints`**: Core ticket repository storing tracking ID, GPS coordinates (`latitude`, `longitude`), photo proof, priority, status, assigned staff, **`resolution_image_url`**, **`resolution_notes`**, **`citizen_rating`**, and **`citizen_feedback`**.
- **`assignments`**: Audit logs of departmental and staff dispatches.
- **`status_history`**: Immutable event history tracking who changed status, timestamp, and remarks.

---

## 🚀 How to Run the Project Locally

### Prerequisites
- Node.js (v18+)
- MySQL or XAMPP (Running on port 3306)

### Step 1: Database Setup
Start MySQL in XAMPP (or standard MySQL service). The database `test_civic` is automatically initialized and seeded by running:

```bash
cd backend
npm run seed
```

### Step 2: Start Backend Server
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000`.*

### Step 3: Start Frontend Client
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 🧪 Automated End-to-End Test Suite

Run the full automated test suite verifying all 11 user journeys (Registration → Filing → Triage → Progress → Proof Upload → Citizen 5-Star Sign-Off):

```bash
cd backend
node run_tests.js
```
