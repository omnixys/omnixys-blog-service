import type { FastifyReply, FastifyRequest } from 'fastify';

export interface GqlFastifyContext {
  req: FastifyRequest;
  res: FastifyReply;
}
