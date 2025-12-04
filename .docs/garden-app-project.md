# Gardening Portfolio Platform - Project Architecture

## Project Overview
A mobile-first portfolio platform for a gardening company with AI-powered content management, featuring a public-facing website and PWA admin interface.

## Tech Stack

### Frontend
- **Public Website**: Next.js (React framework with SSR/SSG)
- **Admin Interface**: React PWA (Progressive Web App)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS (mobile-first)
- **State Management**: React Context API / Zustand
- **Image Optimization**: Next.js Image component (automatic optimization)

### Backend
- **API Server**: Go (Golang)
- **Framework**: Gin or Echo
- **API Style**: RESTful
- **Authentication**: JWT tokens

### Infrastructure (GCP)
- **Public Website Hosting**: Cloud Run (Next.js SSR) or Firebase Hosting (SSG)
- **Backend API**: Cloud Run (Go server, serverless, auto-scaling)
- **Database**: Firestore (real-time sync, offline support)
- **File Storage**: Cloud Storage
- **CDN**: Cloud CDN (image delivery)
- **Functions**: Cloud Functions (image processing)
- **AI Services**: 
  - OpenAI GPT-4 API (descriptions, content generation)
  - Google Cloud Vision API (plant identification backup)

## Architecture Diagram

```
┌─────────────────┐         ┌─────────────────┐
│ Public Website  │         │   Admin PWA     │
│   (Next.js)     │         │    (React)      │
│  SSR/SSG/ISR    │         └────────┬────────┘
└────────┬────────┘                  │
         │        HTTPS/REST          │
         └───────────┬────────────────┘
                     │
              ┌──────▼──────┐
              │   Cloud     │
              │   Run       │
              │ (Go Backend)│
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌───▼────┐ ┌───▼─────┐
    │Firestore│ │ Cloud  │ │  Cloud  │
    │         │ │Storage │ │Functions│
    └─────────┘ └───┬────┘ └────┬────┘
                    │            │
                    │     ┌──────▼─────┐
                    │     │   Vision   │
                    │     │    API     │
                    │     └────────────┘
              ┌─────▼──────┐
              │  Cloud CDN │
              └────────────┘
```

## Monorepo Structure

```
garden_app/
├── packages/
│   └── shared/                      # Shared types & utilities
│       ├── src/
│       │   ├── types/
│       │   │   ├── project.ts
│       │   │   ├── plant.ts
│       │   │   ├── user.ts
│       │   │   └── api.ts
│       │   └── utils/
│       │       └── validation.ts
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   ├── web/                         # Next.js public site
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   │
│   ├── admin/                       # Vite + React PWA
│   │   ├── src/
│   │   └── package.json
│   │
│   └── backend/                     # Go API
│       ├── cmd/
│       ├── internal/
│       └── go.mod
│
├── package.json                     # Workspace root
├── pnpm-workspace.yaml              # pnpm workspaces
└── turbo.json                       # Optional: Turborepo for faster builds
```

### Shared Package Usage

```typescript
// In apps/web or apps/admin
import { Project, Plant, AdminUser } from '@garden/shared'
```

## Next.js Page Structure (App Router)

```
app/
├── layout.tsx                   # Root layout (header, footer, nav)
├── page.tsx                     # Homepage - hero + featured projects (/)
├── globals.css                  # Global styles
├── loading.tsx                  # Global loading skeleton
├── not-found.tsx                # Global 404 page
│
├── projects/
│   ├── page.tsx                 # Projects grid (/projects)
│   ├── loading.tsx              # Loading state for projects
│   ├── [id]/
│   │   ├── page.tsx             # Project detail + gallery (/projects/abc123)
│   │   └── not-found.tsx        # Project not found
│   └── category/
│       └── [category]/
│           └── page.tsx         # Filter by category (/projects/category/residential)
│
├── plants/
│   ├── page.tsx                 # Plant encyclopedia (/plants)
│   └── [slug]/
│       └── page.tsx             # Individual plant info (/plants/rose)
│
├── about/
│   └── page.tsx                 # Company story (/about)
│
├── services/
│   └── page.tsx                 # Service offerings (/services)
│
└── contact/
    └── page.tsx                 # Contact form (/contact)

components/
├── Header.tsx                   # Site navigation
├── Footer.tsx                   # Footer with links
├── ProjectCard.tsx              # Project preview card
├── ProjectGallery.tsx           # Image gallery component
├── PlantCard.tsx                # Plant preview card
└── ContactForm.tsx              # Contact form (client component)

lib/
├── api.ts                       # Backend API helper functions
└── utils.ts                     # Shared utilities

types/
├── project.ts                   # Project interfaces
├── plant.ts                     # Plant interfaces
└── api.ts                       # API response types
```

### Route Summary

| Route | Page | Rendering |
|-------|------|-----------|
| `/` | Homepage with hero + featured | SSG + ISR |
| `/projects` | All projects grid | SSG + ISR |
| `/projects/[id]` | Project detail | SSG + ISR |
| `/projects/category/[category]` | Filtered projects | SSG + ISR |
| `/plants` | Plant encyclopedia | SSG + ISR |
| `/plants/[slug]` | Plant detail | SSG + ISR |
| `/about` | Company info | SSG |
| `/services` | Service list | SSG |
| `/contact` | Contact form | SSG (form is client component) |

## Admin PWA Structure (Vite + React)

```
apps/admin/
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json
│
├── public/
│   ├── manifest.json                # PWA manifest
│   └── icons/                       # PWA icons
│
└── src/
    ├── main.tsx                     # App entry
    ├── App.tsx                      # Router setup
    ├── vite-env.d.ts
    │
    ├── components/
    │   ├── ui/                      # Reusable UI (buttons, inputs, modals)
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   └── Modal.tsx
    │   ├── layout/
    │   │   ├── AppShell.tsx         # Main layout with sidebar
    │   │   ├── Sidebar.tsx
    │   │   └── Header.tsx
    │   ├── projects/
    │   │   ├── ProjectForm.tsx
    │   │   ├── ProjectCard.tsx
    │   │   └── ImageUploader.tsx
    │   └── plants/
    │       ├── PlantForm.tsx
    │       └── PlantCard.tsx
    │
    ├── pages/
    │   ├── Login.tsx
    │   ├── Dashboard.tsx            # Simple links for now
    │   ├── projects/
    │   │   ├── ProjectList.tsx
    │   │   ├── ProjectCreate.tsx
    │   │   └── ProjectEdit.tsx
    │   ├── plants/
    │   │   ├── PlantList.tsx
    │   │   ├── PlantCreate.tsx
    │   │   └── PlantEdit.tsx
    │   └── Settings.tsx
    │
    ├── hooks/
    │   ├── useAuth.ts               # Firebase auth hook
    │   ├── useProjects.ts           # Project data fetching
    │   ├── usePlants.ts
    │   └── useImageUpload.ts        # Client-side resize + upload
    │
    ├── services/
    │   ├── api.ts                   # Backend API calls
    │   ├── firebase.ts              # Firebase config
    │   └── storage.ts               # Cloud Storage helpers
    │
    ├── stores/
    │   └── authStore.ts             # Zustand auth state
    │
    └── utils/
        └── imageResize.ts           # Client-side image processing
```

### Admin Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/login` | Login | Google Sign-In |
| `/` | Dashboard | Quick links, overview |
| `/projects` | ProjectList | All projects grid |
| `/projects/new` | ProjectCreate | Create project form |
| `/projects/:id` | ProjectEdit | Edit project, manage images |
| `/plants` | PlantList | All plants |
| `/plants/new` | PlantCreate | Create plant |
| `/plants/:id` | PlantEdit | Edit plant |
| `/settings` | Settings | Profile, preferences |

### PWA Configuration

**manifest.json:**
```json
{
  "name": "Garden Portfolio Admin",
  "short_name": "Garden Admin",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#22c55e",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**vite.config.ts (with PWA plugin):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // Use public/manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

## TypeScript Interfaces (packages/shared)

Located in `packages/shared/src/types/` and imported across all apps.

### Project Types (`types/project.ts`)
```typescript
export type ProjectCategory = 'residential' | 'commercial' | 'landscape'

export interface AIGeneratedContent {
  description: boolean
  plantIdentifications: string[]
}

export interface ProjectImage {
  id: string
  thumbnail: string
  standard: string
}

export interface Project {
  id: string
  title: string
  description: string
  location: string
  completedDate: string
  category: ProjectCategory
  coverImage: string              // References an image ID
  images: ProjectImage[]
  aiGenerated?: AIGeneratedContent
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectCreateInput {
  title: string
  description?: string
  location: string
  category: ProjectCategory
  images: string[]
}
```

### Plant Types (`types/plant.ts`)
```typescript
export type PlantIdentificationSource = 'vision_api' | 'gpt' | 'manual'

export interface Plant {
  id: string
  commonName: string
  scientificName: string
  description: string
  careInstructions: string
  images: string[]
  identifiedBy: PlantIdentificationSource
  usedInProjects: string[]
  createdAt: string
}
```

### API Types (`types/api.ts`)
```typescript
export interface APIResponse<T> {
  data: T
  success: boolean
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
```

## Data Model

### Collections (Firestore)

#### Projects
```json
{
  "id": "project_uuid",
  "title": "Modern Garden Renovation",
  "description": "AI-generated or manual description",
  "location": "City, State",
  "completedDate": "2024-11-15",
  "category": "residential | commercial | landscape",
  "coverImage": "image_id_1",
  "images": [
    {
      "id": "image_id_1",
      "thumbnail": "storage_url_thumb",
      "standard": "storage_url_std"
    }
  ],
  "aiGenerated": {
    "description": true,
    "plantIdentifications": ["Rose", "Lavender"]
  },
  "featured": false,
  "published": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Plants
```json
{
  "id": "plant_uuid",
  "commonName": "Rose",
  "scientificName": "Rosa",
  "description": "AI-generated description",
  "careInstructions": "Full sun, regular watering",
  "images": ["storage_url"],
  "identifiedBy": "vision_api | gpt | manual",
  "usedInProjects": ["project_id_1", "project_id_2"],
  "createdAt": "timestamp"
}
```

### AdminUser Type (`types/user.ts`)
```typescript
export type AdminRole = 'admin' | 'editor'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  createdAt: string
}
```

### Users (Admin)
```json
{
  "id": "user_uuid",
  "email": "admin@garden.com",
  "role": "admin | editor",
  "name": "John Doe",
  "createdAt": "timestamp"
}
```

## API Endpoints

### Public API (Read-only)
```
GET  /api/v1/projects              - List all published projects
GET  /api/v1/projects/:id          - Get project details
GET  /api/v1/projects/featured     - Get featured projects
GET  /api/v1/plants                - List plants
GET  /api/v1/plants/:id            - Get plant details
```

### Admin API (Authenticated)
```
POST   /api/v1/auth/login          - Admin login
POST   /api/v1/auth/refresh        - Refresh JWT token

POST   /api/v1/projects            - Create project
PUT    /api/v1/projects/:id        - Update project
DELETE /api/v1/projects/:id        - Delete project

POST   /api/v1/images/upload       - Get signed upload URL
POST   /api/v1/images/analyze      - Analyze image with Vision API

POST   /api/v1/ai/generate-description  - Generate project description
POST   /api/v1/ai/identify-plant        - Identify plant from image
```

## Image Specification

### Processing Pipeline

```
Mobile Upload (4000x3000, ~8MB)
         │
         ▼
  Client-Side Resize (max 2500px, 85%, strip EXIF)
         │
         ▼
  Upload (~500KB)
         │
         ▼
   Cloud Function
         │
    ┌────┴────┐
    │ Process │
    ├─────────┤
    │ • Detect orientation
    │ • Resize to 2 variants
    │ • Convert to WebP
    │ • Apply quality compression
    └────┬────┘
         │
         ▼
   Save to Cloud Storage
```

### Generated Variants

| Variant | Dimensions | Quality | Format | Use Case |
|---------|-----------|---------|--------|----------|
| Thumbnail | 400px (long edge) | 75% | WebP | Grid views, cards, cover |
| Standard | 1200px (long edge) | 85% | WebP | Detail pages, lightbox |

### Aspect Ratios

| Orientation | Ratio | Notes |
|-------------|-------|-------|
| Landscape | 3:2 | Standard photo ratio |
| Portrait | 2:3 | Inverted for vertical shots |

### Client-Side Pre-Processing (Before Upload)

- Max dimension: 2500px (longest edge)
- Format: Convert HEIC → JPEG
- Quality: 85%
- Strip EXIF: Yes (privacy, removes GPS data)

### Storage Structure

```
projects/{project_id}/
└── images/
    ├── {image_id}_thumb.webp    # 400px, ~30KB
    ├── {image_id}_std.webp      # 1200px, ~100KB
    └── ...
```

### Storage Estimates

| Per Image | Per Project (50 images) | Per 100 Projects |
|-----------|------------------------|------------------|
| ~130KB | ~6.5MB | ~650MB |

### Cover Image Handling

- `coverImage` field stores reference to an image ID
- Frontend uses thumbnail variant with CSS `object-fit: cover`
- Admin can change cover by selecting any image from project gallery
- No additional image processing required

## Cloud Storage Structure

```
garden-portfolio-bucket/
├── projects/
│   └── {project_id}/
│       └── images/
│           ├── {image_id}_thumb.webp
│           └── {image_id}_std.webp
├── plants/
│   └── {plant_id}/
│       ├── {image_id}_thumb.webp
│       └── {image_id}_std.webp
└── temp/
    └── {upload_id}/
        └── temp_file.jpg (deleted after 1 day)
```

## Cloud Functions

### Image Processing Function
- **Trigger**: Cloud Storage upload
- **Actions**:
  - Generate multiple sizes (thumbnail, medium, large)
  - Optimize quality/compression
  - Update Firestore with processed URLs
  - Clean up original if configured

### Lifecycle Policy (Future Implementation)
- Standard storage: Current year projects
- Nearline storage: 1+ year old projects
- Delete temp files after 1 day
- Keep max 3 versions of edited images

## AI Integration Flow

### Generate Description
1. Admin uploads project images
2. Admin clicks "Generate Description"
3. Backend sends images + context to GPT-4
4. Returns formatted description
5. Admin reviews and edits before saving

### Plant Identification
1. Admin uploads plant image
2. Backend tries Vision API first (faster, cheaper)
3. If confidence < 80%, escalate to GPT-4 Vision
4. Return plant name + care suggestions
5. Admin confirms and saves to database

## Monitoring & Logging

### Cloud Logging (Automatic)

| Service | What's Captured |
|---------|-----------------|
| Cloud Run | Go backend logs, API requests, errors |
| Cloud Functions | Image processing logs, failures |
| Firestore | Read/write operations |

Backend logging is automatic - write to stdout:
```go
log.Printf("Project created: %s", projectID)
```

### Cloud Monitoring

- **Uptime checks**: Public site and API health
- **Alert policies**:
  - Cloud Run error rate > 5%
  - Cloud Function failures
  - API latency > 2s
- **Dashboards**: Built-in GCP dashboards for all services

### Google Analytics (GA4) - Public Website

- Page views and user journeys
- Project engagement (most viewed projects)
- Traffic sources (search, social, direct)
- Device breakdown (mobile vs desktop)
- Geographic data (local SEO insights)

### Firebase Analytics - Admin PWA

- Admin action tracking (uploads, edits, publishes)
- Feature usage (AI description generation frequency)
- PWA install rates
- Session duration and patterns

### Implementation

| Tool | Integration | Effort |
|------|-------------|--------|
| Cloud Logging | Automatic with GCP services | None |
| Cloud Monitoring | Configure alerts in GCP Console | Low |
| GA4 | Add script to Next.js root layout | Low |
| Firebase Analytics | Add Firebase SDK to PWA | Low |

## Security & Authentication

### Firebase Auth Setup

| Setting | Choice |
|---------|--------|
| Sign-in method | Google Sign-In |
| User creation | Manual via Firebase Console |
| Roles | `admin` and `editor` |
| Session | Firebase default (1 hour token, auto-refresh) |

### Authentication Flow

```
Admin opens PWA
       │
       ▼
  Google Sign-In
  (Firebase Auth)
       │
       ▼
  Firebase returns ID Token
       │
       ▼
  PWA stores token in memory
       │
       ▼
  API requests include token
  Authorization: Bearer {token}
       │
       ▼
  Go backend verifies token
  (Firebase Admin SDK)
       │
       ▼
  Check user role in Firestore
       │
       ▼
  Return protected data
```

### User Roles

| Role | Permissions |
|------|-------------|
| `admin` | Full access: create, edit, delete, manage users |
| `editor` | Create and edit only, no delete |

### Role Enforcement

**Firestore** - Store role in users collection (see AdminUser type)

**Go Backend** - Check role before protected operations:
```go
if user.Role != "admin" {
    return errors.New("permission denied")
}
```

### Other Security

### Authentication
- Admin PWA: Firebase Auth (Google Sign-In)
- Public site: No auth required (read-only)

### Storage Security Rules
- Public read for published content
- Admin write access only
- Signed URLs for direct uploads (expire in 15 minutes)

### API Rate Limiting
- Public API: 100 req/min per IP
- Admin API: 500 req/min per user
- AI endpoints: 10 req/min per user (cost control)

## Environment Configuration

### GCP/Firebase Project Structure

| Environment | Firebase Account | Billing | Deploys On |
|-------------|------------------|---------|------------|
| Dev | Developer's | Developer's billing | Push to `dev` |
| Preview | Developer's | Developer's billing | Pull requests |
| Prod | Client's | Client's billing | Merge to `main` |

### Environment Variables

| Variable | Dev | Prod |
|----------|-----|------|
| `API_URL` | `https://api-dev.garden.com` | `https://api.garden.com` |
| `FIREBASE_PROJECT` | `garden-portfolio-dev` | `garden-portfolio-prod` |
| `GCP_PROJECT` | `garden-portfolio-dev` | `garden-portfolio-prod` |
| `OPENAI_API_KEY` | GitHub Secrets | GitHub Secrets |

### Secrets Management

**GitHub Secrets (CI/CD):**
- `GCP_SA_KEY_DEV` - Service account JSON for dev deployments
- `GCP_SA_KEY_PROD` - Service account JSON for prod deployments (from client)
- `OPENAI_API_KEY` - AI API key

**GCP Secret Manager (Runtime):**
- API keys accessed by Cloud Run at runtime
- More secure than environment variables for sensitive data

## CI/CD Pipeline

### Branch Strategy

| Branch | Environment | Trigger |
|--------|-------------|---------|
| `dev` | Development | Push |
| `main` | Production | Merge |
| PR branches | Preview | Pull request |

### GitHub Workflows

```
.github/
└── workflows/
    ├── deploy-dev.yml      # Triggers on push to dev
    ├── deploy-prod.yml     # Triggers on merge to main
    ├── preview.yml         # Triggers on pull requests
    └── test.yml            # Runs on all PRs
```

### Deployment Flow

```
Feature Branch
       │
       ▼
  Pull Request
       │
       ├──► Run tests
       │
       └──► Deploy preview
              │
              ▼
         Review & Approve
              │
              ▼
         Merge to dev
              │
              ▼
         Deploy to dev environment
              │
              ▼
         Test in dev
              │
              ▼
         Merge to main
              │
              ▼
         Deploy to production
```

### Workflow: Deploy Dev (`deploy-dev.yml`)

```yaml
name: Deploy Dev
on:
  push:
    branches: [dev]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY_DEV }}
      - name: Deploy to Cloud Run
        run: gcloud run deploy api-dev --source ./backend

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Next.js
        run: npm run build
        env:
          API_URL: ${{ vars.DEV_API_URL }}
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          firebaseServiceAccount: ${{ secrets.GCP_SA_KEY_DEV }}
          projectId: garden-portfolio-dev
```

### Workflow: Deploy Prod (`deploy-prod.yml`)

```yaml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY_PROD }}
      - name: Deploy to Cloud Run
        run: gcloud run deploy api --source ./backend

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Next.js
        run: npm run build
        env:
          API_URL: ${{ vars.PROD_API_URL }}
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          firebaseServiceAccount: ${{ secrets.GCP_SA_KEY_PROD }}
          projectId: garden-portfolio-prod
```

## Development Phases

### Phase 1: MVP Core (4-6 weeks)
- [ ] Go backend with basic CRUD APIs
- [ ] Firestore setup and data models
- [ ] Cloud Storage integration
- [ ] Admin PWA: Login and project management
- [ ] Public website: Display projects
- [ ] Basic image upload and display

### Phase 2: AI Features (2-3 weeks)
- [ ] GPT-4 description generation
- [ ] Vision API plant identification
- [ ] Image analysis in admin interface

### Phase 3: Optimization (2 weeks)
- [ ] Cloud Functions for image processing
- [ ] Cloud CDN setup
- [ ] PWA offline functionality
- [ ] Performance optimization

### Phase 4: Polish (1-2 weeks)
- [ ] Lifecycle policies
- [ ] Advanced search/filtering
- [ ] Analytics integration
- [ ] Admin dashboard with stats

## Performance Targets

- **Public Website**:
  - First Contentful Paint: < 1.5s
  - Largest Contentful Paint: < 2.5s
  - Lighthouse Score: 90+

- **Admin PWA**:
  - Works offline for content entry
  - Sync when connection restored
  - Installable on mobile devices

## Cost Estimates (Monthly)

*Based on moderate traffic: 10k visitors/month, 100 projects*

- Cloud Run: ~$10-20 (scales to zero)
- Firestore: ~$5-15
- Cloud Storage: ~$5-10
- Cloud CDN: ~$10-20
- Cloud Functions: ~$5
- AI APIs: ~$20-50 (depends on usage)

**Total: ~$55-120/month**

## Notes
- Keep track of lifecycle policy requirements for future implementation
- Next.js provides excellent SEO through SSR/SSG - critical for local search visibility
- Consider ISR (Incremental Static Regeneration) for project pages - fast static pages that auto-update
- Monitor AI API costs closely in production
- Next.js Image component automatically optimizes images for different screen sizes