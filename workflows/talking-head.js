import Bark from '../models/bark.js'
import Kandinsky from '../models/kandinsky.js'
import SadTalker from '../models/sadtalker.js'
import ReplicateModel from '../models/replicate-model.js'

class TalkingHead extends ReplicateModel {
  constructor(replicate, defaultInputs = {}) {
    super(replicate, defaultInputs)
    this.bark = new Bark(this.replicate, {
      history_prompt: 'announcer'
    }, this.outputDirectory)
    this.kandinsky = new Kandinsky(this.replicate, {}, this.outputDirectory)
    this.sadTalker = new SadTalker(this.replicate, {
      enhancer: 'gfpgan',
      preprocess: 'full',
      still: true
    }, this.outputDirectory)
  }

  async predict(input) {
    const barkOutput = await this.bark.predict({ prompt: input.prompt })
    const kandinskyOutput = await this.kandinsky.predict({ prompt: input.image_prompt })
    const sadTalkerInput = {
      source_image: kandinskyOutput,
      driven_audio: barkOutput
    }

    return await this.sadTalker.predict(sadTalkerInput)
  }
}

export default TalkingHead;
