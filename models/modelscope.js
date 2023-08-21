import ReplicateModel from '../lib/replicate-model.js'

class ModelScope extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'cjwbw'
    this.modelName = 'damo-text-to-video'
    this.version = '1e205ea73084bd17a0a3b43396e49ba0d6bc2e754e9283b2df49fad2dcf95755'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.mp4`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default ModelScope
