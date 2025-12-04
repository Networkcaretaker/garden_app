# Phase 2: AI & UI Enhancement - Implementation Checklist

This checklist covers the implementation of AI-powered features, UI/UX refinements for the admin and public apps, and the first deployment to a development environment.

## 1. Backend & AI Integration (Go API)

This section focuses on building the server-side logic for AI features.

- [ ] **AI Service Configuration:**
    - [ ] Add OpenAI API Key to a new `secrets.toml` file for local development (and ensure it's in `.gitignore`).
    - [ ] Load the API key into the Go application's configuration (`internal/config`).
- [ ] **AI Endpoint: Generate Description:**
    - [ ] Create a new handler: `POST /api/v1/ai/generate-description`.
    - [ ] The handler should accept a project's title, category, and maybe a list of image URLs.
    - [ ] Implement a client to call the OpenAI GPT-4 API with a carefully crafted prompt.
    - [ ] Return the generated text description as a JSON response.
- [ ] **AI Endpoint: Plant Identification (Optional Stretch Goal):**
    - [ ] Create a new handler: `POST /api/v1/ai/identify-plant`.
    - [ ] Implement a client to call the Google Cloud Vision API.
    - [ ] If confidence is low, add logic to escalate to GPT-4 Vision as planned.
    - [ ] Update the `Plant` type in `packages/shared` to store identification results.

## 2. Admin PWA (React) Refinements

This section enhances the content management experience.

- [ ] **AI Feature Integration:**
    - [ ] In the `ProjectCreate` and `ProjectEdit` pages, add a "Generate with AI" button next to the description field.
    - [ ] On click, call the new `/api/v1/ai/generate-description` backend endpoint.
    - [ ] Populate the description `textarea` with the AI-generated content, allowing the admin to review and edit it before saving.
- [ ] **Image Management UI:**
    - [ ] **Image Reordering:** Implement drag-and-drop functionality in the `ProjectEdit` image grid using a library like `dnd-kit`.
    - [ ] **Image Metadata:** Add a modal or inline fields to edit metadata for each image (e.g., a caption or alt text).
    - [ ] **Image Grouping:** Implement UI to group images by a tag or category (e.g., "Before", "After", "Spring 2025"). This will require updating the `ProjectImage` type in `packages/shared`.
- [ ] **General UI/UX:**
    - [ ] **Category Management:** Create a new settings page (`/settings/categories`) where admins can add, edit, or delete `ProjectCategory` tags.
    - [ ] **Thumbnail Previews:** Ensure that all image lists and grids use the `_thumb.webp` variant for faster load times.

## 3. Public Website (Next.js) Enhancements

This section focuses on making the public-facing site more engaging, professional, and discoverable.

- [ ] **Styling & Layout:**
    - [ ] **Landing Page:** Design and build out the homepage (`/`) to include a hero section, a brief "About Us" summary, and a grid of "Featured" projects.
    - [ ] **Image Grids:** Implement a more dynamic image grid on the project detail page (`/projects/[id]`) using CSS Grid or a library like `react-photo-album` for a masonry layout.
    - [ ] **Responsiveness:** Thoroughly test and refine the styling across all pages for mobile, tablet, and desktop breakpoints.
- [ ] **Search Engine Optimization (SEO):**
    - [ ] **Metadata:** Use Next.js `generateMetadata` function in layouts and pages to dynamically set titles and descriptions.
    - [ ] **Structured Data:** Create and include JSON-LD structured data for projects to improve their appearance in Google search results.
    - [ ] **`sitemap.xml` & `robots.txt`:** Create static files to guide search engine crawlers.
- [ ] **Comments Section (New Feature):**
    - [ ] **Decision:** Choose a commenting engine (e.g., a self-hosted solution using Firestore, or a third-party service like Disqus).
    - [ ] **Backend:** If self-hosting, create new Firestore collections and backend endpoints (`GET /projects/:id/comments`, `POST /projects/:id/comments`).
    - [ ] **Frontend:** Add the comment form and display list to the bottom of the project detail page (`/projects/[id]`).

## 4. Deployment & CI/CD

This section covers the first deployment to a live, non-local environment.

- [ ] **GCP/Firebase Setup (Dev Environment):**
    - [ ] Create a new, separate Firebase project for development (e.g., `garden-projects-dev`).
    - [ ] Enable Firestore, Authentication, and Storage for the new dev project.
- [ ] **GitHub Actions (CI/CD):**
    - [ ] Create GitHub Secrets to store the service account key for the new `dev` project (`GCP_SA_KEY_DEV`).
    - [ ] Create a `deploy-dev.yml` workflow file in `.github/workflows/`.
    - [ ] **Backend Job:** Configure the workflow to build the Go app and deploy it to Cloud Run on every push to the `dev` branch.
    - [ ] **Frontend Job:** Configure the workflow to build the Next.js app and deploy it to Firebase Hosting.
- [ ] **Initial Deployment:**
    - [ ] Create a `dev` branch in your Git repository.
    - [ ] Push your current code to the `dev` branch to trigger the first deployment.
    - [ ] Verify that both the frontend and backend are accessible at their respective `dev` URLs.