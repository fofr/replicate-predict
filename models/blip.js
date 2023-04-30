import ImageInputModel from './image-input-model.js'

class Blip extends ImageInputModel {
  constructor(replicate, defaulInputs) {
    super(replicate, defaulInputs)
    this.user = 'salesforce'
    this.model = 'blip'
    this.version = '2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746'
  }

  async saveOutputs(prediction, input) {
    const caption = prediction.split('Caption: ')[1]
    const text =
`${input.originalImage}
---
${prediction}`
    await this.saveFile(text, `${this.generateFileName(caption)}.txt`)
  }
}

export default Blip
