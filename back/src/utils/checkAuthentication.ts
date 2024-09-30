import { FastifyReply, FastifyRequest } from 'fastify';
import { authenticate } from '../middleware/authMiddleware';
import { ClientError } from '../errors/client-error';

export const checkAuthentication = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  await authenticate(request, reply);
  const reqUser = request.user;
  if (!reqUser) {
    throw new ClientError('User not authenticated');
  }
  return reqUser;
};
