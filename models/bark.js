import ReplicateModel from './replicate-model.js'

class Bark extends ReplicateModel {
  constructor(replicate, defaulInputs) {
    super(replicate, defaulInputs)
    this.user = 'suno-ai'
    this.model = 'bark'
    this.version = 'b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787'
    this.promptSplit = '\n---\n'
  }

  async output(prediction) {
    return prediction.audio_out
  }

  async saveOutputs(prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction.audio_out, `${fileNameBase}.wav`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default Bark
