import ReplicateModel from '../lib/replicate-model.js'

class StableLM extends ReplicateModel {
  constructor(replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'stability-ai'
    this.model = 'stablelm-tuned-alpha-7b'
    this.version = 'c49dae362cbaecd2ceabb5bd34fdb68413c4ff775111fea065d259d577757beb'
  }

  output(prediction) {
    return prediction.join('')
  }

  async saveOutputs(prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    const text =
`${input.prompt}
---
${this.output(prediction)}`
    await this.saveFile(text, `${fileNameBase}.txt`)
  }
}

export default StableLM
