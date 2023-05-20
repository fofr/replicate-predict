import ReplicateModel from '../lib/replicate-model.js'

class Tortoise extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    voice_a: 'random',
    voice_b: 'random',
    voice_c: 'random'
  }) {
    super(replicate, defaultInputs)
    this.user = 'afiaka87'
    this.model = 'tortoise-tts'
    this.version = 'e9658de4b325863c4fcdc12d94bb7c9b54cbfe351b7ca1b36860008172b91c71'
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
