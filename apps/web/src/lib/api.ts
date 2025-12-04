import { Project } from '@garden/shared';

// Ensure this environment variable is available at build time!
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProjects(): Promise<Project[]> {
  // FIX: Change 'no-store' to revalidation.
  // This allows the build to succeed by treating it as static data that refreshes.
  const res = await fetch(`${API_URL}/projects`, { 
    next: { revalidate: 60 } 
  });

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  return res.json();
}

export async function getProject(id: string): Promise<Project | undefined> {
  // We can also cache the single project fetch if we had a specific endpoint
  // For now, since we filter the list, the list caching above handles it.
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}