import ReplicateModel from '../lib/replicate-model.js'

class Tortoise extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    voice_a: 'random',
    voice_b: 'random',
    voice_c: 'random'
  }) {
    super(replicate, defaultInputs)
    this.user = 'afiaka87'
    this.modelName = 'tortoise-tts'
    this.promptSplit = '\n---\n'
    this.defaultSingleInputName = 'text'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.text)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.mp3`)
    await this.savePrompt(input.text, `${fileNameBase}.txt`)
  }
}

export default Tortoise
