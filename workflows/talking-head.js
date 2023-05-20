import Tortoise from '../models/tortoise.js'
import Kandinsky from '../models/kandinsky.js'
import SadTalker from '../models/sadtalker.js'
import ReplicateModel from '../lib/replicate-model.js'

class TalkingHead extends ReplicateModel {
  constructor (replicate, defaultInputs = {}) {
    super(replicate, defaultInputs)
    this.tortoise = new Tortoise(this.replicate, {
      voice_a: 'william'
    })
    this.kandinsky = new Kandinsky(this.replicate)
    this.sadTalker = new SadTalker(this.replicate, {
      enhancer: 'gfpgan',
      preprocess: 'full'
    }, this.outputDirectory)
  }

  async predict(input) {
    const tortoisePromise = this.tortoise.predict({ text: input.prompt })
    const kandinskyPromise = this.kandinsky.predict({ prompt: input.image_prompt || 'a portrait photo of a man' })
    const [tortoiseOutput, kandinskyOutput] = await Promise.all([tortoisePromise, kandinskyPromise])

    const sadTalkerInput = {
      source_image: kandinskyOutput,
      driven_audio: tortoiseOutput
    }

    return await this.sadTalker.predict(sadTalkerInput)
  }
}

export default TalkingHead
