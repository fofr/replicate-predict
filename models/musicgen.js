import ReplicateModel from '../lib/replicate-model.js'

class MusicGen extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'joehoover'
    this.model = 'musicgen-melody'
    this.version = 'daba6434500d14d10b9865fd09c4aa9d9d9651ca68f164e99061f955a18008ac'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.wav`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default MusicGen
