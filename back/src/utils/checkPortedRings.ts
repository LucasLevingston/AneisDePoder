import { ClientError } from '../errors/client-error';
import { getAllRingsByBearerId } from '../services/ringService';
import { getById } from '../services/userService';

export const checkPortedRings = async (bearerId: string) => {
  const user = await getById(bearerId);
  if (!user) {
    throw new ClientError('User not found');
  }
  const rings = (await getAllRingsByBearerId(bearerId)) || [];

  let limit = 0;

  switch (user.class) {
    case 'Elfo':
      limit = 3;
      break;
    case 'Anões':
      limit = 7;
      break;
    case 'Homem':
      limit = 9;
      break;
    case 'Sauron':
      limit = 1;
      break;
    default:
      throw new ClientError('Unknown race');
  }

  if (rings.length >= limit) {
    throw new ClientError('You have reached the limit of rings allowed for your class.');
  }
};
