import { ClientError } from '../errors/client-error';
import { getRingService } from '../services/ringService';

export const checkRingExists = async (ringId: number) => {
  const ring = await getRingService(ringId);
  if (!ring) {
    throw new ClientError('Ring not found');
  }
  return ring;
};
