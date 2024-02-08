import PollsRepository from "./domain/polls/repositories/Concretes/polls.repository";
import IPollsRepository from "./domain/polls/repositories/Interfaces/ipolls.repository";
import container from "./inversify.container";

container.bind<IPollsRepository>(IPollsRepository).to(PollsRepository)