export enum AuthStrategy {
  JWT = 'JWT',
  Secret = 'SECRET',
}

export enum AuthError {
  InvalidLoginCredentials = 'Invalid login credentials',
  InvalidToken = 'Invalid token',
  InvalidSecret = 'Invalid secret',
  AccessDenied = 'Access restricted to admin and manager users only',
  PasswordRequired = 'Password is required',
  UserRole = 'User role not found',
}

export enum AuthSuccess {
  LoginSuccess = 'Login successful',
  LogoutSuccess = 'Logout successful',
}

export interface User {
  _id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  status: string;
  message: string;
  data: Omit<User, 'password'>;
}
