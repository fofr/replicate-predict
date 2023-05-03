/* eslint-env jest */
import { parseArgs } from '../../lib/arg-parser.js'

describe('parseArgs', () => {
  test('No arguments', () => {
    const args = []
    const expectedResult = {}

    expect(parseArgs(args)).toEqual(expectedResult)
  })

  test('One unnamed argument', () => {
    const args = ['input1']
    const expectedResult = {
      unnamedArg0: 'input1'
    }

    expect(parseArgs(args)).toEqual(expectedResult)
  })

  test('Multiple unnamed arguments', () => {
    const args = ['input1', 'input2']
    const expectedResult = {
      unnamedArg0: 'input1',
      unnamedArg1: 'input2'
    }

    expect(parseArgs(args)).toEqual(expectedResult)
  })

  test('Named arguments', () => {
    const args = ['--option1', 'value1', '--option2', 'value2']
    const expectedResult = {
      option1: 'value1',
      option2: 'value2'
    }

    expect(parseArgs(args)).toEqual(expectedResult)
  })

  test('Mixed arguments', () => {
    const args = ['input1', '--option1', 'value1', 'input2', '--option2', 'value2']
    const expectedResult = {
      unnamedArg0: 'input1',
      option1: 'value1',
      unnamedArg1: 'input2',
      option2: 'value2'
    }

    expect(parseArgs(args)).toEqual(expectedResult)
  })

  test('Arguments with numbers', () => {
    const args = ['input1', '--option1', '42', '3.14', '--option2', 'value2']
    const expectedResult = {
      unnamedArg0: 'input1',
      option1: 42,
      unnamedArg1: 3.14,
      option2: 'value2'
    }

    expect(parseArgs(args)).toEqual(expectedResult)
  })
})
