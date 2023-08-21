import ReplicateModel from '../lib/replicate-model.js'

class MusicGen extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'joehoover'
    this.modelName = 'musicgen-melody'
    this.version = '2c56751d7f8642caf84cc64ec583c70087ac5ed90b27ca0005d00ff1be505417'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.wav`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default MusicGen
