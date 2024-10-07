import type { FastifyInstance } from 'fastify'
import { ClientError } from '../errors/client-error'
import { ZodError } from 'zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Invalid input',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error.message === 'Ring not found' || error.message === 'User not found') {
    return reply.status(404).send({ message: error.message })
  }

  if (error instanceof ClientError) {
    return reply.status(403).send({
      message: error.message,
    })
  }

  if (
    error.message === 'Invalid token' ||
    error.message === 'Unauthorized to perform this action'
  ) {
    return reply.status(401).send({ message: error.message })
  }
  console.log(error)
  return reply.status(500).send({ message: 'Internal server errorrrr' })
}
