import fs from 'fs/promises'
import path from 'path'

class ReplicateModel {
  constructor(replicate, defaultInputs = {}) {
    this.replicate = replicate
    this.defaultInputs = defaultInputs
    this.identifier = `${this.user}/${this.model}:${this.version}`
  }

  mergeInputWithDefaults(input) {
    return {
      ...this.defaultInputs,
      ...input
    }
  }

  generateFileName(prompt) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
    const promptStart = prompt.slice(0, 30).replace(/\s+/g, '_')
    return `${timestamp}_${promptStart}`
  }

  async predict(input) {
    if (!this.identifier) {
      throw new Error('Identifier must be defined in the derived class.')
    }

    const mergedInput = this.mergeInputWithDefaults(input)
    console.log('Running', this.constructor.name, mergedInput)
    return await this.replicate.run(this.identifier, { input: mergedInput })
  }

  async predictMany(inputs = [], poolLimit = 5) {
    return asyncPool(poolLimit, inputs, async input => {
      return await this.predict(input)
    })
  }

  async savePrompt(promptText, fileName) {
    await fs.writeFile(path.join(this.outputDirectory, fileName), promptText)
  }

  async readPromptsFromFile(fileName) {
    const content = await fs.readFile(fileName, 'utf-8')
    const prompts = content.split('\n')
    return prompts.filter(prompt => prompt.trim().length > 0)
  }

  async runAll() {
    const prompts = await this.readPromptsFromFile(this.inputFilePath)
    const inputs = prompts.map(prompt => ({ prompt: prompt.trim() }))
    await this.predictMany(inputs)
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

export default ReplicateModel
