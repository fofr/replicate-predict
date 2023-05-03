import ImageInputModel from '../lib/image-input-model.js'

class ControlNet extends ImageInputModel {
  constructor (replicate, defaultInputs = { structure: 'canny' }) {
    super(replicate, defaultInputs)
    this.user = 'rossjillian'
    this.model = 'controlnet_1-1'
    this.version = 'fe97435bfd17881fadfb8e290ebbf172f5835ac2ee015509d9d66b61a24bc5d3'
  }

  async saveOutputs (prediction) {
    await this.saveFileUsingCurl(prediction)
  }
}

export default ControlNet
