import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { eggRateValidationSchema } from 'validationSchema/egg-rates';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.egg_rate
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEggRateById();
    case 'PUT':
      return updateEggRateById();
    case 'DELETE':
      return deleteEggRateById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEggRateById() {
    const data = await prisma.egg_rate.findFirst(convertQueryToPrismaUtil(req.query, 'egg_rate'));
    return res.status(200).json(data);
  }

  async function updateEggRateById() {
    await eggRateValidationSchema.validate(req.body);
    const data = await prisma.egg_rate.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEggRateById() {
    const data = await prisma.egg_rate.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
