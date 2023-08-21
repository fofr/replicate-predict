import ReplicateModel from '../lib/replicate-model.js'

class Bark extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'suno-ai'
    this.modelName = 'bark'
    this.promptSplit = '\n---\n'
  }

  output (prediction) {
    return prediction.audio_out
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction.audio_out, `${fileNameBase}.wav`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default Bark
