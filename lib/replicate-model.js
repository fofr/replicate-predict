import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'

class ReplicateModel {
  constructor (replicate, defaultInputs = {}, outputDirectory = null) {
    this.replicate = replicate
    this.defaultInputs = defaultInputs
    this.promptSplit = '\n'
    this.defaultSingleInputName = 'prompt'
    this.outputDirectory = outputDirectory || `outputs/${this.constructor.name.toLowerCase()}`
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

  identifier () {
    return `${this.user}/${this.model}:${this.version}`
  }

  mergeInputWithDefaults (input) {
    const mergedInputs = {
      ...this.defaultInputs,
      ...input
    }

    // Do not pass the originalImage input to the model
    delete mergedInputs.originalImage

    return mergedInputs
  }

  timestamp () {
    return new Date().toISOString().replace(/[-:.]/g, '')
  }

  generateFileName (text) {
    if (!text) {
      return this.timestamp()
    }

    const textStart = text.slice(0, 30).replace(/\s+/g, '_')
    return `${this.timestamp()}_${textStart}`
  }

  async predict (input) {
    const mergedInput = this.mergeInputWithDefaults(input)
    console.log('Running', this.constructor.name, truncateDataStrings(mergedInput))

    try {
      const prediction = await this.replicate.run(this.identifier(), { input: mergedInput })
      if (typeof this.saveOutputs === 'function') {
        await this.saveOutputs(prediction, truncateDataStrings(mergedInput))
      }

      return this.output(prediction)
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async predictMany (inputs = [], poolLimit = 5) {
    return asyncPool(poolLimit, inputs, async input => {
      return await this.predict(input)
    })
  }

  async saveFile (text, fileName) {
    await fs.writeFile(path.join(this.outputDirectory, fileName), text)
  }

  async saveInputAndPrediction (input, prediction, fileName) {
    let defaultInput = input[this.defaultSingleInputName] || false
    if (defaultInput) {
      defaultInput = `${defaultInput}\n\n`
    }
    await this.saveFile(`${defaultInput}${JSON.stringify(input)}\n\n${JSON.stringify(prediction)}`, fileName)
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
    const inputs = prompts.map(prompt => ({ [this.defaultSingleInputName]: prompt.trim() }))
    await this.predictMany(inputs)
  }

  async saveFilesUsingCurl (urls, fileName = null, directory = this.outputDirectory) {
    if (typeof urls === 'string') {
      urls = [urls]
    }

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      const indexFileName = fileName.replace(/(\.[\w\d_-]+)$/i, `-${i}$1`)
      await this.saveFileUsingCurl(url, indexFileName, directory)
    }
  }

  async convertFileToWebp (filename) {
    const filenameAsWebp = filename.replace(/\.[\w\d_-]+$/i, '.webp')
    const inputPath = path.join(this.outputDirectory, filename)
    const outputPath = path.join(this.outputDirectory, filenameAsWebp)

    const command = `cwebp -q 80 "${inputPath}" -o "${outputPath}"`
    return new Promise((resolve, _reject) => {
      exec(command, error => {
        if (error) {
          console.error(error)
          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  async saveFileUsingCurl (url, fileName = null, directory = this.outputDirectory) {
    return new Promise((resolve, reject) => {
      if (!fileName) {
        const urlObj = new URL(url)
        fileName = `${Date.now()}-${path.basename(urlObj.pathname)}`
      }

      const outputPath = path.join(directory, fileName)
      const curlCommand = `curl -s -L -o "${outputPath}" "${url}"`

      exec(curlCommand, error => {
        if (error) {
          console.error(error)
          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  output (prediction) {
    return prediction
  }

  async loadImageAsDataURI (inputPath) {
    if (isURL(inputPath)) {
      return inputPath
    }

    const data = await fs.readFile(inputPath)
    const base64 = data.toString('base64')
    const fileExtension = path.extname(inputPath)

    switch (fileExtension) {
      case '.png':
        return `data:image/png;base64,${base64}`
      case '.jpg':
      case '.jpeg':
        return `data:image/jpeg;base64,${base64}`
      case '.mp4':
        return `data:video/mp4;base64,${base64}`
      default:
        throw new Error(`Unsupported file extension: ${fileExtension}`)
    }
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

function truncateDataStrings (obj) {
  const newObj = { ...obj }
  for (const key in newObj) {
    if (typeof newObj[key] === 'string' && newObj[key].startsWith('data:')) {
      newObj[key] = newObj[key].substring(0, 100) + '...'
    }
  }

  return newObj
}

/* eslint-disable no-new */
function isURL (str) {
  try {
    new URL(str)
    return true
  } catch (_) {
    return false
  }
}

export default ReplicateModel
