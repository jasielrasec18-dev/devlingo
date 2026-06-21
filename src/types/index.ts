export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

export type { CreateUserProfileInput, CreateUserProfileResult } from './user';
