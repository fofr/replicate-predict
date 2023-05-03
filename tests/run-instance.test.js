/* eslint-env jest */
import { runInstance } from '../lib/run-instance.js'

class MockInstance {
  constructor (shouldThrow) {
    this.shouldThrow = shouldThrow
  }

  async runAll () {
    if (this.shouldThrow) {
      throw new Error('Error in runAll')
    }
    return 'All run'
  }

  async predict (options) {
    if (this.shouldThrow) {
      throw new Error('Error in predict')
    }
    return options
  }

  get defaultSingleInputName () {
    return 'input'
  }
}

describe('runInstance', () => {
  test('should run all with --all', async () => {
    const instance = new MockInstance(false)
    const options = { unnamedArg0: '--all' }
    const result = await runInstance(instance, options)

    expect(result).toBe('All run')
  })

  test('should run predict', async () => {
    const instance = new MockInstance(false)
    const options = { input: 'test' }
    const result = await runInstance(instance, options)

    expect(result).toEqual({ input: 'test' })
  })

  test('should throw error when input is missing', async () => {
    const instance = new MockInstance(false)
    const options = {}

    await expect(runInstance(instance, options)).rejects.toThrow('Missing input for input')
  })

  test('should handle errors in runAll', async () => {
    const instance = new MockInstance(true)
    const options = { unnamedArg0: '--all' }

    await expect(runInstance(instance, options)).rejects.toThrow('Error in runAll')
  })

  test('should handle errors in predict', async () => {
    const instance = new MockInstance(true)
    const options = { input: 'test' }

    await expect(runInstance(instance, options)).rejects.toThrow('Error in predict')
  })
})
