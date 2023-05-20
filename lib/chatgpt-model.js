import { config } from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'
import fs from 'fs/promises'
import path from 'path'
config()

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY
})

class ChatGPTModel {
  constructor (_replicate, defaultInputs = {}) {
    this.api = api
    this.defaultInputs = defaultInputs
    this.promptSplit = '\n'
    this.defaultSingleInputName = 'prompt'
    this.outputDirectory = `outputs/${this.constructor.name.toLowerCase()}`
    this.inputFilePath = `inputs/${this.constructor.name.toLowerCase()}-prompts.txt`
    this.ensureDirectoryExists(this.outputDirectory)
  }

  async ensureDirectoryExists (directoryPath) {
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

  mergeInputWithDefaults (input) {
    return {
      ...this.defaultInputs,
      ...input
    }
  }

  generateFileName (text) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
    if (!text) {
      return timestamp
    }

    const textStart = text.slice(0, 30).replace(/\s+/g, '_')
    return `${timestamp}_${textStart}`
  }

  async predict (input) {
    const mergedInput = this.mergeInputWithDefaults(input)
    console.log('Running', this.constructor.name, mergedInput)

    const options = {}
    if (input.systemMessage) {
      options.systemMessage = input.systemMessage
    }

    const response = await api.sendMessage(input.prompt, options)
    const message = response.text

    if (typeof this.saveOutputs === 'function') {
      await this.saveOutputs(response, input)
    }

    return this.output(message)
  }

  async predictMany (inputs = [], poolLimit = 5) {
    return asyncPool(poolLimit, inputs, async input => {
      return await this.predict(input)
    })
  }

  async saveFile (text, fileName) {
    await fs.writeFile(path.join(this.outputDirectory, fileName), text)
  }

  async savePrompt (text, fileName) {
    await this.saveFile(text, fileName)
  }

  async readPromptsFromFile (fileName) {
    const content = await fs.readFile(fileName, 'utf-8')
    const prompts = content.split(this.promptSplit)
    return prompts.filter(prompt => prompt.trim().length > 0)
  }

  async runAll () {
    const prompts = await this.readPromptsFromFile(this.inputFilePath)
    const inputs = prompts.map(prompt => ({ prompt: prompt.trim() }))
    await this.predictMany(inputs)
  }

  output (prediction) {
    return prediction
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    const text =
`${input.prompt}
---
${this.output(prediction)}`
    await this.saveFile(text, `${fileNameBase}.txt`)
  }
}

async function asyncPool (poolLimit, array, iteratorFn) {
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

export default ChatGPTModel
