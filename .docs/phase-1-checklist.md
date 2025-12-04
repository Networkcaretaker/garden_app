Phase 1: MVP Core - Implementation Checklist

This checklist covers the initialization of the "Garden Portfolio" monorepo from scratch, setting up the infrastructure, and implementing the core MVP features defined in Phase 1 (Basic CRUD, Authentication, and Image Upload).

1. Environment & Monorepo Setup

Establishes the "Blank Slate" root structure.

[x] System Prerequisites Check

[x] Confirm Go installed (1.21+)

[x] Confirm Node.js installed (LTS)

[x] Confirm npm installed (comes with Node)

[x] Repository Initialization

[x] Create root directory garden_app

[x] git init

[x] Create root .gitignore (Node, Go, OS junk files)

[x] Run npm init -y in root

[x] Workspace Configuration

[x] Open package.json and add: "workspaces": ["packages/*", "apps/*"]

[x] Folder Structure Creation

[x] mkdir packages/shared

[x] mkdir apps/web

[x] mkdir apps/admin

[x] mkdir apps/backend

2. Infrastructure (GCP & Firebase)

Setting up the cloud environment before coding connectors.

[x] Project Creation

[x] Create Firebase Project (Name: garden-projects)

[x] Upgrade to Blaze Plan (Required for Cloud Functions/Storage usage)

[x] Service Activation

[x] Enable Firestore Database

[x] Enable Firebase Authentication (Google Sign-In provider)

[x] Enable Cloud Storage

[x] Enable Cloud Run API (via GCP Console)

[x] Credentials Management

[x] Generate Service Account Key (JSON) for Go Backend

[x] Get Firebase Client Config (API Key, App ID) for Web/Admin

[x] Add .env patterns to .gitignore immediately

3. Shared Package (packages/shared)

Type definitions used by both Admin, Web, and potentially Backend validation.

[x] Initialization

[x] cd packages/shared

[x] npm init -y

[x] Install TypeScript: npm install -D typescript

[x] Create tsconfig.json (Composite project settings)

[x] Type Definitions (Copy from Arch Doc)

[x] Create src/types/project.ts

[x] Create src/types/plant.ts

[x] Create src/types/user.ts

[x] Create src/types/api.ts

[x] Build Step

[x] Configure package.json exports/main

[x] Verify build runs: npm run build

4. Backend API (apps/backend) - Go

The brain of the operation.

[x] Initialization

[x] go mod init github.com/Networkcaretaker/garden_app/backend

[x] Dependencies

[x] Decision: Framework selected: Echo

[x] go get github.com/labstack/echo/v4

[x] go get firebase.google.com/go/v4 (Firebase Admin SDK)

[x] Core Structure

[x] Setup cmd/server/main.go

[x] Setup internal/config (Env var loading)

[x] Setup internal/db (Firestore client init)

[x] Authentication Middleware

[x] Implement middleware to verify Firebase ID Tokens

[x] CRUD Implementation (Projects)

[x] POST /projects (Create)

[x] GET /projects (List)

[x] PUT /projects/:id (Update)

[x] Image Upload Handlers

[x] Decision: Removed backend upload handler. Logic moved to Client-Side (PWA) in Phase 5 to support offline usage and reduce server load.

5. Admin PWA (apps/admin) - React/Vite

The content management interface.

[x] Initialization

[x] npm create vite@latest (Select React + TypeScript)

[x] Install Tailwind CSS & init config

[x] Install Dependencies: npm install firebase react-router-dom zustand @tanstack/react-query lucide-react

[x] Configuration

[x] Setup vite.config.ts with PWA plugin

[x] Add manifest.json

[x] Core Components

[x] Setup Firebase Client (src/services/firebase.ts)

[x] Create AuthProvider (Handle Google Sign-In)

[x] Create App Shell (Sidebar/Layout)

[x] Features (Phase 1)

[x] Login Page: Email/Password Sign-In

[x] Project List: Fetch from Go API

[x] Project Create Form: Inputs for Title, Desc, Category

[x] Data Structure Refactor:

[x] Update Shared Type (ProjectImage with metadata)

[x] Update Go Model (Struct tags)

[x] Project Edit View:

[x] Fetch Single Project details

[x] Image Grid: Delete existing, Add new

[x] FIX: Backend Image Deletion (Use Storage Path)

[x] Save changes to Backend (PUT)

[ ] Future Considerations (Phase 2+):

[ ] Image Grouping (Seasons/Dates) - Added to notes

6. Public Website (apps/web) - Next.js

The public face.

[x] Initialization

[x] npx create-next-app@latest (Use App Router, TypeScript, Tailwind)

[x] Clean up default boilerplate

[x] Configuration

[x] Setup environment variables (.env.local)

[x] Data Fetching

[x] Create API client to fetch from Go Backend (or Firestore directly if SSG preferred)

[x] Pages (Phase 1)

[x] Homepage (/): Static layout

[x] Projects Index (/projects): Grid of project thumbnails

[x] Project Detail (/projects/[id]): Title, description, image gallery

7. Integration & Verification

[x] End-to-End Test

Log into Admin.

Create a new Project.

Upload a photo.

Save.

Verify data exists in Firestore Console.

Verify image exists in Storage Console.

Open Public Website and verify the new project appears.