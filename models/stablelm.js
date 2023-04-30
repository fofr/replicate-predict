import ReplicateModel from './replicate-model.js'

class StableLM extends ReplicateModel {
  constructor(replicate, defaulInputs) {
    super(replicate, defaulInputs)
    this.user = 'stability-ai'
    this.model = 'stablelm-tuned-alpha-7b'
    this.version = 'c49dae362cbaecd2ceabb5bd34fdb68413c4ff775111fea065d259d577757beb'
  }

  async saveOutputs(prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    const text =
`${input.prompt}
---
${prediction.join('')}`
    await this.saveTextFile(text, `${fileNameBase}.txt`)
  }
}

export default StableLM
