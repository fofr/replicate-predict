import ImageInputModel from './image-input-model.js'

class RealESRGAN extends ImageInputModel {
  constructor(replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'nightmareai'
    this.model = 'real-esrgan'
    this.version = '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b'
  }

  async saveOutputs(prediction) {
    await this.saveFileUsingCurl(prediction)
  }
}

export default RealESRGAN
