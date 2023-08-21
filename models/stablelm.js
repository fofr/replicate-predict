import ReplicateModel from '../lib/replicate-model.js'

class StableLM extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'stability-ai'
    this.modelName = 'stablelm-tuned-alpha-7b'
  }

  output (prediction) {
    return prediction.join('')
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

export default StableLM
