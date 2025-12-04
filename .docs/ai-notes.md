**Project Overview:**
This is a mobile-first portfolio platform for a gardening company. It consists of:
1.  **Backend:** Go (Golang) API using Echo framework and Firestore. It handles data persistence and business logic.
2.  **Admin PWA:** React + Vite app for content management (uploading photos, managing projects). It uses Firebase Auth.
3.  **Public Website:** Next.js 15 app (App Router) for displaying the portfolio to clients.
4.  **Shared:** A TypeScript package (`@garden/shared`) for common type definitions.

**Current Status (Phase 1 Complete):**
- The monorepo structure is set up (npm workspaces).
- The Go backend is running, connected to Firestore, and has CRUD endpoints for Projects.
- The Admin PWA is built with a custom App Shell, Sidebar, Login (Firebase Auth), and pages to Create/Edit projects.
- Image uploads are handled via a "Hybrid" approach: The frontend resizes and uploads to Firebase Storage, then sends the path to the backend. The backend handles cleanup (deleting old images on update).
- The Public Website (Next.js) is initialized and configured to fetch data from the Go backend.

**Next Goals:**
I am starting Phase 2. My focus will be on:
1.  Enhancing the Public Website (landing page, styling, responsiveness, SEO, comments section).
2.  Refining the Admin UI (image reordering, image data, image rotation, thumbnails, image grouping, category settings).
3.  Implementing AI features (generating project descriptions using AI GTPs).
4.  Enhance Images on Public Website (grid layouts, image groups)
5.  deploy dev project to cloud

Please use this context to help me with code generation, debugging, and architectural decisions moving forward. I have placed documents in the `/.docs` folder. There is the `garden-app-project.md` that outlines the original project plan although some things have been changed during phase one, please read the `phase_1_checklist.md` in my workspace if you need specific details.