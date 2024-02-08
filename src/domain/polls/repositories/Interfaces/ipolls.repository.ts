const IPollsRepository = Symbol('IPollsRepository')

interface IPollsRepository {
    create(title: string, options: Array<string>): Promise<string>
}

export default IPollsRepository