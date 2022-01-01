import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileError } from './ShowUserProfileError';

import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase

describe('Show Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should Be able to show user', async () => {
    const userToCreate = {
      email: 'user@example.com',
      name: 'user',
      password: 'password'
    }

    const { id } = await createUserUseCase.execute(userToCreate)

    const user = await showUserProfileUseCase.execute(String(id))

    expect(user).toBeTruthy()
  })

  it(`should't Be able to show unexistent user`, async () => {
    expect(async () => {
      const id = 'random.id.from.no.user'

      await showUserProfileUseCase.execute(String(id))
    })
    .rejects.toBeInstanceOf(ShowUserProfileError)
  })

})
