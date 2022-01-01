import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new  CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should authenticate user', async () => {
    const userToCreate = {
      email: 'user@example.com',
      name: 'user',
      password: 'password'
    }

    await createUserUseCase.execute(userToCreate)

    const { user, token } = await authenticateUserUseCase.execute({
      email: userToCreate.email,
      password: userToCreate.password,
    })

    expect(token).toBeTruthy()
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('email')
  })

  it(`shouldn't authenticate user with incorrect Email`, async () => {
    expect(async () => {
      const userToCreate = {
        email: 'user@example.com',
        name: 'user',
        password: 'password'
      }

      await createUserUseCase.execute(userToCreate)

      await authenticateUserUseCase.execute({
        email: 'user2@example.com',
        password: userToCreate.password,
      })
    })
    .rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it(`shouldn't authenticate user with incorrect Password`, async () => {
    expect(async () => {
      const userToCreate = {
        email: 'user@example.com',
        name: 'user',
        password: 'password'
      }

      await createUserUseCase.execute(userToCreate)

      await authenticateUserUseCase.execute({
        email: userToCreate.email,
        password: 'other password',
      })
    })
    .rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
