import ImageInputModel from '../lib/image-input-model.js'

class RealESRGAN extends ImageInputModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'nightmareai'
    this.modelName = 'real-esrgan'
  }

  async saveOutputs (prediction) {
    await this.saveFileUsingCurl(prediction)
  }
}

export default RealESRGAN
