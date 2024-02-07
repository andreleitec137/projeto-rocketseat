import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function getPoll(app: FastifyInstance) {
    app.get('/polls/:pollId', async (request, reply) => {
        const getPolParams = z.object({
            pollId: z.string().uuid(),
        })
    
        const { pollId } = getPolParams.parse(request.params);
    
        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include:{
                options:{
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
    

        return reply.send({
            poll
        })
    })
}