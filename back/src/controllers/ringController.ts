import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createRingService,
  deleteRingService,
  getAllRingsService,
  updateRingService,
} from '../services/ringService';
import { checkPermission } from '../utils/checkPermission';
import { checkRingExists } from '../utils/checkRingExists';
import { checkAuthentication } from '../utils/checkAuthentication';
import { checkPortedRings } from '../utils/checkPortedRings';
import Ring from '../models/ring';

interface RingParams {
  ringId: number;
}

export const getRing = async (
  request: FastifyRequest<{ Params: RingParams }>,
  reply: FastifyReply
) => {
  const { ringId } = request.params;

  const ring = await checkRingExists(ringId);
  return reply.status(200).send(ring);
};

export const getAllRings = async (request: FastifyRequest, reply: FastifyReply) => {
  await checkAuthentication(request, reply);

  const rings = await getAllRingsService();
  return reply.status(200).send(rings);
};

export const createRing = async (
  request: FastifyRequest<{
    Body: {
      name: string;
      power: string;
      bearer: string;
      forgedBy: string;
      image: string;
    };
  }>,
  reply: FastifyReply
) => {
  const reqUser = await checkAuthentication(request, reply);
  await checkPortedRings(reqUser.userId);

  const newRing = await createRingService(request.body);

  return reply.status(201).send(newRing);
};

export const updateRing = async (
  request: FastifyRequest<{
    Params: RingParams;
    Body: { name: string; power: string; bearer: string; image?: string };
  }>,
  reply: FastifyReply
) => {
  const { ringId } = request.params;

  const ring = await checkRingExists(ringId);
  const { userId } = await checkAuthentication(request, reply);

  checkPermission(ring.bearer, userId);

  const updatedRing = await updateRingService({
    ...request.body,
    id: Number(ringId),
  });

  return reply.status(200).send(updatedRing);
};

export const deleteRing = async (
  request: FastifyRequest<{ Params: { ringId: number } }>,
  reply: FastifyReply
) => {
  const { ringId } = request.params;

  const ring = await checkRingExists(ringId);
  const { userId } = await checkAuthentication(request, reply);

  checkPermission(ring.bearer, userId);

  await deleteRingService(ring.id);
  return reply.status(204).send({});
};
