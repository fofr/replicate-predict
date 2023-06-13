import ReplicateModel from '../lib/replicate-model.js'

class MusicGen extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'joehoover'
    this.model = 'musicgen-melody'
    this.version = '1a53415e6c4549e3022a0af82f4bd22b9ae2e747a8193af91b0bdffe63f93dfd'
    this.defaultSingleInputName = 'description'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.description)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.wav`)
    await this.savePrompt(input.description, `${fileNameBase}.txt`)
  }
}

export default MusicGen
