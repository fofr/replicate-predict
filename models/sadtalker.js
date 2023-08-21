import ReplicateModel from '../lib/replicate-model.js'

class SadTalker extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'cjwbw'
    this.modelName = 'sadtalker'
    this.version = '423fe08772f8e2038f4de16e8dc80f26b5e756732445fd42061ff82d73cb1ba3'
    this.defaultSingleInputName = 'source_image'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.mp4`)
  }
}

export default SadTalker
