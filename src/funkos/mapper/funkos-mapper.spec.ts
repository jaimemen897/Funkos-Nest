import { Test, TestingModule } from '@nestjs/testing'
import { FunkosMapper } from './funkos-mapper'

describe('FunkosMapper', () => {
  let provider: FunkosMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunkosMapper],
    }).compile()

    provider = module.get<FunkosMapper>(FunkosMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
