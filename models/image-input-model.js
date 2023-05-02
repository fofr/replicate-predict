import ReplicateModel from './replicate-model.js'

class ImageInputModel extends ReplicateModel {
  constructor(replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.defaultSingleInputName = 'image'
  }

  async predict(input) {
    input.originalImage = input.image
    input.image = await this.loadImageAsDataURI(input.image)
    return await super.predict(input)
  }
}

export default ImageInputModel
