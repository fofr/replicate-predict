import ReplicateModel from './replicate-model.js'
import fs from 'fs/promises'

class Bark extends ReplicateModel {
  constructor(replicate, defaulInputs) {
    this.user = 'suno-ai'
    this.model = 'bark'
    this.version = 'b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787'
    super(replicate, defaulInputs)

    this.inputFilePath = 'inputs/bark-prompts.txt'
    this.outputDirectory = 'outputs/bark'
  }

  async predict(input) {
    const prediction = await super.predict(input)
    await this.saveOutputs(prediction, input)
    return prediction
  }

  async saveOutputs(prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction.audio_out, `${fileNameBase}.wav`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }

  async readPromptsFromFile(fileName) {
    const content = await fs.readFile(fileName, 'utf-8')
    return content.split('\n---\n')
  }
}

export default Bark
