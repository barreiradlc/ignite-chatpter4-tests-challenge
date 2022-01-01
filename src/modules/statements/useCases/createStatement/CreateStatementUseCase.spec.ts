
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should create a new Statement', async () => {
    const userToCreate = {
      email: 'user@example.com',
      name: 'user',
      password: 'password'
    }

    const { id: user_id } = await createUserUseCase.execute(userToCreate)

    const statement = await createStatementUseCase.execute({
      user_id: String(user_id),
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: 'O incentivo ao avanço tecnológico, assim como a necessidade de renovação processual faz parte de um processo de gerenciamento das direções preferenciais no sentido do progresso.'
    })

    expect(statement).toHaveProperty('id')
  })

  it(`should.'t create a new Statement if user is not found`, async () => {
    expect(async () => {
      const user_id = 'random.unexistent.user.id'

      const statement = await createStatementUseCase.execute({
        user_id: String(user_id),
        type: OperationType.DEPOSIT,
        amount: 3000,
        description: 'O incentivo ao avanço tecnológico, assim como a necessidade de renovação processual faz parte de um processo de gerenciamento das direções preferenciais no sentido do progresso.'
      })
    })
    .rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it(`should.'t withdraw Statement if user has not enough funds`, async () => {
    expect(async () => {

      const userToCreate = {
        email: 'user@example.com',
        name: 'user',
        password: 'password'
      }

      const { id: user_id } = await createUserUseCase.execute(userToCreate)

      await createStatementUseCase.execute({
        user_id: String(user_id),
        type: OperationType.DEPOSIT,
        amount: 3000,
        description: 'Joguei no bicho.'
      })

      await createStatementUseCase.execute({
        user_id: String(user_id),
        type: OperationType.WITHDRAW,
        amount: 3500,
        description: 'Pix para pagar a parcela 56 do kinder ovo.'
      })
    })
    .rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

})
