import { User } from 'generated/prisma/client';

export type ValidatedUser = Pick<User, 'id' | 'username'>;

export interface AuthenticatedRequest extends Request {
  user: ValidatedUser;
}
