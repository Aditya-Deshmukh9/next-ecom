export interface NewUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface EmailVerifyRequest {
  token: string;
  userId: string;
}
