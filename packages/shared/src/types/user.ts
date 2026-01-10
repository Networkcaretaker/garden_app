export type UserRole = 'admin' | 'editor';

export interface UserDetails {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}