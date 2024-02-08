import "reflect-metadata";
import { prisma } from "../../../../lib/prisma";
import { PrismaClient } from '@prisma/client'
import IPollsRepository from "../Interfaces/ipolls.repository";
import { injectable } from "inversify";

@injectable()
class PollsRepository implements IPollsRepository {
    private database: PrismaClient

    constructor(){
        this.database = prisma
    }

    async create(title: string, options: string[]): Promise<string> {
        const poll = await this.database.poll.create({
            data: {
                title,
                options: {
                    createMany: {
                        data:  options.map((option) => {
                            return { title: option }
                        })
                    }
                }
            }
        });

        return poll.id;
    }
}

export default PollsRepository;