import ReplicateModel from './replicate-model.js'
import path from 'path'
import { exec } from 'child_process'

class Kandinsky extends ReplicateModel {
  constructor(replicate, defaulInputs) {
    this.user = 'ai-forever'
    this.model = 'kandinsky-2'
    this.version = '601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f'
    super(replicate, defaulInputs)

    this.inputFilePath = 'inputs/kandinsky-prompts.txt'
    this.outputDirectory = 'outputs/kandinsky'
  }

  async predict(input) {
    const prediction = await super.predict(input)
    await this.saveOutputs(prediction, input)
    return prediction
  }

  async saveImage(imageUrl, fileName) {
    return new Promise((resolve, reject) => {
      const outputPath = path.join(this.outputDirectory, fileName)
      const curlCommand = `curl -s -L -o "${outputPath}" "${imageUrl}"`

      exec(curlCommand, error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  async saveOutputs(prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveImage(prediction[0], `${fileNameBase}.png`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default Kandinsky
