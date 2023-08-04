import { Request } from 'express';

// Define the custom interface for authenticated user
interface AuthenticatedUser {
  userid: string;
  username: string;
}

// Extend the Request interface to include the custom property
declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

export {};

// see doc https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html

