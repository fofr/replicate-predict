import ReplicateModel from '../lib/replicate-model.js'

class SadTalker extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'cjwbw'
    this.modelName = 'sadtalker'
    this.defaultSingleInputName = 'source_image'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction, fileNameBase)
  }
}

export default SadTalker
