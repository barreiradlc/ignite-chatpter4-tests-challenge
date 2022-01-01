import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase


describe('Get Balance', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should get the Balance of the user', async () => {
    const userToCreate = {
      email: 'user@example.com',
      name: 'user',
      password: 'password'
    }

    const { id: user_id } = await createUserUseCase.execute(userToCreate)

    const statement1 = await createStatementUseCase.execute({
      user_id: String(user_id),
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: 'O incentivo ao avanço tecnológico, assim como a necessidade de renovação processual faz parte de um processo de gerenciamento das direções preferenciais no sentido do progresso.'
    })

    const statement2 = await createStatementUseCase.execute({
      user_id: String(user_id),
      type: OperationType.WITHDRAW,
      amount: 1200,
      description: 'Vrau, conta de luz!'
    })

    const balance = await getBalanceUseCase.execute({ user_id: String(user_id) })

    expect(balance.statement).toEqual([statement1, statement2])
  })

  it(`should't get the Balance if there's no such user`, async () => {
    expect(async () => {
      const user_id = 'random.invalid.user'

      await getBalanceUseCase.execute({ user_id: String(user_id) })
    })
    .rejects.toBeInstanceOf(GetBalanceError)
  })

})
