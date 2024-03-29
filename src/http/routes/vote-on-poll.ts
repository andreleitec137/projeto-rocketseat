import z from "zod";
import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function voteOnPoll(app: FastifyInstance) {
    app.post('/polls/:pollId/votes', async (request, reply) => {
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid(),
        })

        const voteOnPollParams = z.object({
            pollId: z.string().uuid(),
        })
    
        const { pollOptionId } = voteOnPollBody.parse(request.body);
        const { pollId } = voteOnPollParams.parse(request.params);

        let {sessionId} = request.cookies

        if(sessionId){
            const userPreviousVotesOnPoll = await prisma.vote.findUnique({
                where:{
                   sessionId_pollId:{
                        sessionId,
                        pollId
                   }
                }
            })

            if(userPreviousVotesOnPoll){
                
                if(userPreviousVotesOnPoll.pollOptionId === pollOptionId){
                    return reply.status(400).send("Você já votou nesta enquete");
                } 

               await prisma.vote.delete({
                    where: {
                        id: userPreviousVotesOnPoll.id
                    }
               })
            }
        }
        if(!sessionId){
            sessionId = randomUUID();

            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30,
                signed: true,
                httpOnly: true
            })
        }

        
        await prisma.vote.create({
            data: {
                sessionId,
                pollId,
                pollOptionId
            }
        })

        return reply.status(201).send()
    })
}