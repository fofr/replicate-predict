import ImageInputModel from '../lib/image-input-model.js'

class ControlNet extends ImageInputModel {
  constructor (replicate, defaultInputs = { structure: 'canny' }) {
    super(replicate, defaultInputs)
    this.user = 'rossjillian'
    this.modelName = 'controlnet_1-1'
  }

  async saveOutputs (prediction) {
    await this.saveFileUsingCurl(prediction)
  }
}

export default ControlNet
