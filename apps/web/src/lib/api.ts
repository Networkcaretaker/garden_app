import { Project } from '@garden/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Simple fetch wrapper for Server Components
export async function getProjects(): Promise<Project[]> {
  // 'no-store' means it fetches fresh data on every request (good for development)
  // In production, we might want 'force-cache' or revalidate time.
  const res = await fetch(`${API_URL}/projects`, { cache: 'no-store' });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch projects');
  }

  return res.json();
}

export async function getProject(id: string): Promise<Project | undefined> {
  // Since our backend currently only has a "List All" endpoint,
  // we fetch all and filter. In Phase 2, we should add GET /projects/:id to backend.
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}