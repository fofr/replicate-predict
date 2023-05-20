import ReplicateModel from '../lib/replicate-model.js'

class InstructBlip extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'joehoover'
    this.model = 'instructblip-vicuna13b'
    this.version = 'c4c54e3c8c97cd50c2d2fec9be3b6065563ccf7d43787fb99f84151b867178fe'
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
