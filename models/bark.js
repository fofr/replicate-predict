import ReplicateModel from './replicate-model.js'
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'

class Bark extends ReplicateModel {
  constructor (replicate) {
    super(replicate)
    this.user = 'suno-ai'
    this.model = 'bark'
    this.version = 'b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787'
    this.identifier = `${this.user}/${this.model}:${this.version}`
    this.defaultInputs = {}
  }

  mergeInputWithDefaults (input) {
    return {
      ...this.defaultInputs,
      ...input
    }
  }

  async predict (inputs = []) {
    return asyncPool(5, inputs, async input => {
      const mergedInput = this.mergeInputWithDefaults(input)
      const prediction = await super.predict(mergedInput)
      await this.saveOutputs(prediction, input)
      return prediction
    })
  }

  async saveAudio (audioUrl, fileName) {
    return new Promise((resolve, reject) => {
      const outputPath = path.join('outputs', 'bark', fileName)
      const curlCommand = `curl -s -L -o "${outputPath}" "${audioUrl}"`

      exec(curlCommand, error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  async savePrompt (promptText, fileName) {
    await fs.writeFile(path.join('outputs', 'bark', fileName), promptText)
  }

  generateFileName (prompt) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
    const promptStart = prompt.slice(0, 10).replace(/\s+/g, '_')
    return `${timestamp}_${promptStart}`
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveAudio(prediction.audio_out, `${fileNameBase}.wav`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }

  async readPromptsFromFile (fileName) {
    const content = await fs.readFile(fileName, 'utf-8')
    return content.split('\n---\n')
  }

  async runAll () {
    const prompts = await this.readPromptsFromFile('bark-prompts.txt')
    const inputs = prompts.map(prompt => ({ prompt: prompt.trim() }))
    await this.predict(inputs)
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

export default Bark
