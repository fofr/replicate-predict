import ReplicateModel from '../lib/replicate-model.js'

class Tango extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    steps: 100,
    guidance: 3
  }) {
    super(replicate, defaultInputs)
    this.user = 'cjwbw'
    this.modelName = 'tango'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.wav`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default Tango
