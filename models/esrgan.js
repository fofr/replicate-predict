import ImageInputModel from '../lib/image-input-model.js'

class RealESRGAN extends ImageInputModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'nightmareai'
    this.modelName = 'real-esrgan'
  }
}

export default RealESRGAN
