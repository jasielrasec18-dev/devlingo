export type CreateUserProfileInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserProfileResult =
  | { success: true; data: unknown }
  | { success: false; error: string };
