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
}

export default Tortoise
