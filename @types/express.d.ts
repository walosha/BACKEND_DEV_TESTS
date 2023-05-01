export interface UserPayload {
  id?: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}
