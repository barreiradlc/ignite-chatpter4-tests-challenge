import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('Should be able to create a new user', async () => {
    const userToCreate = {
      email: 'user@example.com',
      name: 'user',
      password: 'password'
    }

    const user  = await createUserUseCase.execute(userToCreate)

    expect(user).toHaveProperty('id')
  })

  it(`Shouldn't be able to permit a creation of a duplicate user`, async () => {
    expect(async () => {
      const userToCreate = {
        email: 'user@example.com',
        name: 'user',
        password: 'password'
      }

      await createUserUseCase.execute(userToCreate)
      await createUserUseCase.execute(userToCreate)
    })
    .rejects.toBeInstanceOf(CreateUserError)
  })

})
