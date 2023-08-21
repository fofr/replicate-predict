import ReplicateModel from '../lib/replicate-model.js'

class ModelScope extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'cjwbw'
    this.modelName = 'damo-text-to-video'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.mp4`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default ModelScope
