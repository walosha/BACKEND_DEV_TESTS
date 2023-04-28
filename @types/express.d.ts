export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}
