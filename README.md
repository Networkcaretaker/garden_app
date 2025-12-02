# Garden Portfolio Platform 🌿

A modern, full-stack platform for managing and showcasing gardening projects. Built with a focus on performance, mobile usability, and clean architecture.

## 🚀 Overview

This monorepo contains the complete ecosystem for the Garden Portfolio platform:

- **Public Website**: A fast, SEO-optimized Next.js site to display projects to clients.
- **Admin PWA**: A mobile-first React app for managing content, uploading photos, and organizing projects on the go.
- **Backend API**: A robust Go (Golang) server handling data persistence, business logic, and file management.

## 🛠 Tech Stack

### Frontend (Public)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Features**: Server Components, Image Optimization

### Admin (Private)
- **Framework**: React + Vite
- **Type**: Progressive Web App (PWA)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Auth**: Firebase Authentication

### Backend
- **Language**: Go (Golang) 1.21+
- **Framework**: Echo v4
- **Database**: Google Cloud Firestore
- **Storage**: Google Cloud Storage (Firebase)

## 📂 Project Structure

```
garden_app/
├── apps/
│   ├── admin/      # React PWA for content management
│   ├── backend/    # Go API Server
│   └── web/        # Next.js Public Website
├── packages/
│   └── shared/     # Shared TypeScript types & utilities
└── package.json    # Root workspace configuration
```

## ⚡ Getting Started

### Prerequisites
- Node.js (LTS) & npm
- Go 1.21+
- Firebase Project (Firestore & Storage enabled)

### 1. Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Networkcaretaker/garden_app.git
cd garden_app
npm install
```

### 2. Backend Setup

Navigate to the backend directory and set up the environment:

1. Create `apps/backend/.env`:

```env
PORT=8080
ENV=development
FIREBASE_CREDENTIALS_FILE=service-account.json
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

2. Place your Firebase `service-account.json` key in `apps/backend/`

3. Run the server:

```bash
cd apps/backend
go run cmd/server/main.go
```

### 3. Admin App Setup

Navigate to the admin app and configure environment variables:

1. Create `apps/admin/.env.local`:

```env
VITE_API_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

2. Run the development server:

```bash
cd apps/admin
npm run dev
```

### 4. Web App Setup

Navigate to the web app:

1. Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. Run the development server:

```bash
cd apps/web
npm run dev
```

## 🧪 Key Features Implemented (Phase 1)

- [x] **Authentication**: Secure Admin login via Email/Password
- [x] **Project Management**: Create, Read, Update projects
- [x] **Image Handling**: Client-side resizing, Firebase Storage upload, and Backend deletion logic (no orphans!)
- [x] **Data Integrity**: Backend verifies image paths before deletion
- [x] **PWA Support**: Installable Admin app with offline shell

## 📝 License

Private Project. All rights reserved.