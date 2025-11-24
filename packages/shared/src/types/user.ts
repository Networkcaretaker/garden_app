export type AdminRole = 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
}