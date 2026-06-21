export type CreateUserProfileInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserProfileResult =
  | { success: true; data: unknown; requiresEmailConfirmation?: boolean }
  | { success: false; error: string };
