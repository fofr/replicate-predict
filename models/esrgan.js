import ReplicateModel from './replicate-model.js'

class RealESRGAN extends ReplicateModel {
  constructor(replicate, defaulInputs) {
    super(replicate, defaulInputs)
    this.user = 'nightmareai'
    this.model = 'real-esrgan'
    this.version = '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b'
    this.defaultSingleInputName = 'image'
  }

  async predict(input) {
    input.image = await this.loadImageAsDataURI(input.image)
    return await super.predict(input)
  }

  async saveOutputs(prediction) {
    await this.saveFileUsingCurl(prediction)
  }
}

export default RealESRGAN
