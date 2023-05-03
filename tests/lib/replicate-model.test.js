/* eslint-env jest */
import ReplicateModel from '../../lib/replicate-model.js'
import fs from 'fs/promises'
import path, { dirname } from 'path'
import { jest } from '@jest/globals'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class MockReplicate {
  async run () {
    return 'Mock prediction'
  }
}

describe('ReplicateModel', () => {
  const replicate = new MockReplicate()
  const model = new ReplicateModel(replicate)

  afterEach(async () => {
    try {
      await fs.rmdir('outputs/mockmodel', { recursive: true })
    } catch (error) {
      // Ignore errors while cleaning up the output directory
    }
  })

  test('should create output directory', async () => {
    const outputPath = path.join(model.outputDirectory)
    await model.ensureDirectoryExists(outputPath)

    const stats = await fs.stat(outputPath)
    expect(stats.isDirectory()).toBe(true)
  })

  test('should merge input with defaults', () => {
    const input = { prompt: 'Test' }
    const mergedInput = model.mergeInputWithDefaults(input)

    expect(mergedInput).toEqual({ ...model.defaultInputs, ...input })
  })

  test('should predict', async () => {
    const input = { prompt: 'Test' }
    const prediction = await model.predict(input)

    expect(prediction).toBe('Mock prediction')
  })

  test('should read prompts from file', async () => {
    const testInputPath = 'inputs/test-inputs.txt'
    const testInputContent = 'Test1\nTest2\n\nTest3'
    await fs.writeFile(testInputPath, testInputContent)

    const prompts = await model.readPromptsFromFile(testInputPath)

    expect(prompts).toEqual(['Test1', 'Test2', 'Test3'])

    await fs.unlink(testInputPath)
  })

  test('should generate file name with or without text', () => {
    const fileNameWithText = model.generateFileName('Test input')
    expect(fileNameWithText).toMatch(/^\d{8}T\d{6}\d{3}Z_Test_input/)

    const fileNameWithoutText = model.generateFileName()
    expect(fileNameWithoutText).toMatch(/^\d{8}T\d{6}\d{3}Z/)
  })

  test('should save file', async () => {
    const filePath = path.join(model.outputDirectory, 'test-output.txt')
    await model.saveFile('Test content', 'test-output.txt')

    const content = await fs.readFile(filePath, 'utf-8')
    expect(content).toBe('Test content')

    await fs.unlink(filePath)
  })

  test('should save prompt', async () => {
    const filePath = path.join(model.outputDirectory, 'test-prompt.txt')
    await model.savePrompt('Test prompt', 'test-prompt.txt')

    const content = await fs.readFile(filePath, 'utf-8')
    expect(content).toBe('Test prompt')

    await fs.unlink(filePath)
  })

  test('should run all prompts from file', async () => {
    const testInputPath = 'inputs/test-inputs.txt'
    const testInputContent = 'Test1\nTest2\n\nTest3'
    await fs.writeFile(testInputPath, testInputContent)

    const originalInputFilePath = model.inputFilePath
    model.inputFilePath = testInputPath

    const predictManySpy = jest.spyOn(model, 'predictMany')
    const predictSpy = jest.spyOn(model, 'predict')
    await model.runAll()

    expect(predictManySpy).toHaveBeenCalled()
    expect(predictSpy).toHaveBeenCalledTimes(3)

    model.inputFilePath = originalInputFilePath
    await fs.unlink(testInputPath)
  })

  test('should save file using curl', async () => {
    const testImageUrl = 'https://via.placeholder.com/150'
    const testOutputFileName = 'test-image.jpg'
    const outputPath = path.join(model.outputDirectory, testOutputFileName)

    await model.saveFileUsingCurl(testImageUrl, testOutputFileName)

    const stats = await fs.stat(outputPath)
    expect(stats.isFile()).toBe(true)

    await fs.unlink(outputPath)
  })

  test('should return output as is', () => {
    const testOutput = { result: 'Test output' }
    const output = model.output(testOutput)

    expect(output).toEqual(testOutput)
  })

  test('should load image as Data URI', async () => {
    const imagePath = path.join(__dirname, 'test-image.jpg')
    const imageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wcOEBsE_g0_WgAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY3jy5AkABmEDcAqA8b9XAAAAAElFTkSuQmCC', 'base64')
    await fs.writeFile(imagePath, imageData)

    const imageDataURI = await model.loadImageAsDataURI(imagePath)

    expect(imageDataURI).toMatch(/^data:image\/jpeg;base64,/)

    // Test with a URL
    const imageUrl = 'https://via.placeholder.com/150'
    const urlDataURI = await model.loadImageAsDataURI(imageUrl)

    expect(urlDataURI).toBe(imageUrl)

    await fs.unlink(imagePath)
  })

  test('should predict many with varying poolLimit', async () => {
    const inputs = [
      { prompt: 'Test1' },
      { prompt: 'Test2' },
      { prompt: 'Test3' }
    ]

    const predictions = await model.predictMany(inputs, 2)
    expect(predictions).toHaveLength(inputs.length)
    expect(predictions).toEqual(['Mock prediction', 'Mock prediction', 'Mock prediction'])

    const predictionsNoLimit = await model.predictMany(inputs)
    expect(predictionsNoLimit).toHaveLength(inputs.length)
    expect(predictionsNoLimit).toEqual(['Mock prediction', 'Mock prediction', 'Mock prediction'])
  })
})
