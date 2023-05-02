import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'

class ReplicateModel {
  constructor(replicate, defaultInputs = {}, outputDirectory = null) {
    this.replicate = replicate
    this.defaultInputs = defaultInputs
    this.promptSplit = '\n'
    this.defaultSingleInputName = 'prompt'
    this.outputDirectory = outputDirectory || `outputs/${this.constructor.name.toLowerCase()}`
    this.inputFilePath = `inputs/${this.constructor.name.toLowerCase()}-prompts.txt`
    this.ensureDirectoryExists(this.outputDirectory)
  }

  async ensureDirectoryExists(directoryPath) {
    try {
      await fs.access(directoryPath)
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(directoryPath, { recursive: true })
      } else {
        throw error
      }
    }
  }

  identifier() {
    return `${this.user}/${this.model}:${this.version}`
  }

  mergeInputWithDefaults(input) {
    const mergedInputs = {
      ...this.defaultInputs,
      ...input
    }

    // Do not pass the originalImage input to the model
    delete mergedInputs.originalImage

    return mergedInputs
  }

  generateFileName(text) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
    if (!text) {
      return timestamp
    }

    const textStart = text.slice(0, 30).replace(/\s+/g, '_')
    return `${timestamp}_${textStart}`
  }

  async predict(input) {
    const mergedInput = this.mergeInputWithDefaults(input)
    console.log('Running', this.constructor.name, mergedInput)
    const prediction = await this.replicate.run(this.identifier(), { input: mergedInput })

    if (typeof this.saveOutputs === 'function') {
      await this.saveOutputs(prediction, input)
    }

    return this.output(prediction)
  }

  async predictMany(inputs = [], poolLimit = 5) {
    return asyncPool(poolLimit, inputs, async input => {
      return await this.predict(input)
    })
  }

  async saveFile(text, fileName) {
    await fs.writeFile(path.join(this.outputDirectory, fileName), text)
  }

  async savePrompt(text, fileName) {
    await this.saveFile(text, fileName)
  }

  async readPromptsFromFile(fileName) {
    const content = await fs.readFile(fileName, 'utf-8')
    const prompts = content.split(this.promptSplit)
    return prompts.filter(prompt => prompt.trim().length > 0)
  }

  async runAll() {
    const prompts = await this.readPromptsFromFile(this.inputFilePath)
    const inputs = prompts.map(prompt => ({ prompt: prompt.trim() }))
    await this.predictMany(inputs)
  }

  async saveFileUsingCurl(url, fileName = null, directory = this.outputDirectory) {
    return new Promise((resolve, reject) => {
      if (!fileName) {
        const urlObj = new URL(url)
        fileName = `${Date.now()}-${path.basename(urlObj.pathname)}`
      }

      const outputPath = path.join(directory, fileName)
      const curlCommand = `curl -s -L -o "${outputPath}" "${url}"`

      exec(curlCommand, error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  output(prediction) {
    return prediction
  }

  async loadImageAsDataURI(inputPath) {
    if (isURL(inputPath)) {
      return inputPath
    }

    const data = await fs.readFile(imagePath)
    const base64 = data.toString('base64')
    const mimeType = path.extname(imagePath) === '.png' ? 'image/png' : 'image/jpeg'
    return `data:${mimeType};base64,${base64}`
  }
}

async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = []
  const executing = []

  for (const item of array) {
    const p = iteratorFn(item)
    ret.push(p)

    if (poolLimit <= array.length) {
      const e = p.finally(() => {
        executing.splice(executing.indexOf(e), 1)
      })
      executing.push(e)
      if (executing.length >= poolLimit) {
        await Promise.race(executing)
      }
    }
  }

  return Promise.all(ret)
}

function isURL(str) {
  try {
    new URL(str)
    return true
  } catch (_) {
    return false
  }
}

export default ReplicateModel
