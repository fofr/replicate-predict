import ImageInputModel from '../lib/image-input-model.js'

class Blip extends ImageInputModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'salesforce'
    this.modelName = 'blip'
  }

  async saveOutputs (prediction, input) {
    const caption = prediction.split('Caption: ')[1]
    const text =
`${input.originalImage}
---
${prediction}`
    await this.saveFile(text, `${this.generateFileName(caption)}.txt`)
  }
}

export default Blip
