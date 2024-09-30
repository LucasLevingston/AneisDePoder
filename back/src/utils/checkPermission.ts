import { ClientError } from '../errors/client-error';

export const checkPermission = (bearerId: string, userId: string) => {
  if (bearerId !== userId) {
    throw new ClientError('Unauthorized to perform this action');
  }
  return true;
};
