import ReplicateModel from '../lib/replicate-model.js'

class InstructBlip extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    prompt: 'Describe this image'
  }) {
    super(replicate, defaultInputs)
    this.user = 'joehoover'
    this.modelName = 'instructblip-vicuna13b'
    this.defaultSingleInputName = 'img'
  }

  async predict (input) {
    input.originalImage = input.img
    input.img = await this.loadImageAsDataURI(input.img)
    return await super.predict(input)
  }

  output (prediction) {
    return prediction.join('').trim()
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    const text =
`${input.prompt}
---
${this.output(prediction)}`
    await this.saveFile(text, `${fileNameBase}.txt`)
  }
}

export default InstructBlip
