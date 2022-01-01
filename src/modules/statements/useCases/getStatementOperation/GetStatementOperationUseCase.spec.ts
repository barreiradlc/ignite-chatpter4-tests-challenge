import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('Should be able to retrieve some operation', async () => {
    const userToCreate = {
      email: 'user@example.com',
      name: 'user',
      password: 'password'
    }

    const { id: user_id } = await createUserUseCase.execute(userToCreate)

    const newStatement = await createStatementUseCase.execute({
      user_id: String(user_id),
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: 'O incentivo ao avanço tecnológico, assim como a necessidade de renovação processual faz parte de um processo de gerenciamento das direções preferenciais no sentido do progresso.'
    })

    const statement = await getStatementOperationUseCase.execute({ user_id: String(user_id), statement_id: String(newStatement.id) })

    expect(statement).toEqual(newStatement)
  })

  it(`Should't be able to retrieve an unexistent operation`, async () => {
    expect(async () => {
      const user_id = 'random.unexistent.user.id'

      await getStatementOperationUseCase.execute({ user_id: String(user_id), statement_id: 'some.statement.id' })
    })
    .rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

})
