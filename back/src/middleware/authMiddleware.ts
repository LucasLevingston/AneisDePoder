import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/authUtils';
import { ClientError } from '../errors/client-error';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ClientError('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ClientError('Token is missing');
    }

    const decoded = verifyToken(token) as { userId: string };

    if (!decoded || !decoded.userId) {
      throw new ClientError('Invalid token');
    }

    request.user = decoded;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
