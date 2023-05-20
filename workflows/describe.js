import ReplicateModel from '../lib/replicate-model.js'
import InstructBlip from '../models/instructblip.js'
import GPT3 from '../models/gpt3.js'

class Describe extends ReplicateModel {
  constructor (replicate, defaultInputs = {}) {
    super(replicate, defaultInputs)
    this.defaultSingleInputName = 'img'
    this.instructBlip = new InstructBlip(this.replicate, {
      prompt: 'Give a detailed description of the image.',
      max_length: 1024,
      length_penalty: 5
    })
    this.gpt3 = new GPT3(replicate, {
      systemMessage: `
You will be given up to 4 descriptions of images. For each you need to convert it into the format:

[subject], [in the style of], [...keywords]

For example:
- an indian mask in the jungle, in the style of seapunk, urban culture exploration, sfumato, primitive figurines, vacation dadcore, melds mexican and american cultures, tupinipunk
- the animated astronaut is staring upward in space, in the style of colorful caricature, zbrush, skottie young, jeff koons, play with light, gorecore, ferrania p30
- ok ka logo on a black background a gold letter logo icon design ok ka and wave with a circle behind it royalty free illustration, in the style of fine lines, delicate curves, orientalist scenes, leather/hide, poignant
- a drawing of a beast has its feet stretched out, in the style of barroco, controlled chaos, sharp/prickly, outlandish energy, cryptid academia, m42 mount, unilalianism

Match the format shown above. Return them as numbered list items corresponding with the input order.
`
    })
  }

  async predict (input) {
    const blipOutputs = await Promise.all([
      this.instructBlip.predict(input),
      this.instructBlip.predict(input),
      this.instructBlip.predict(input),
      this.instructBlip.predict(input)
    ])

    const joinedOutputNumbered = blipOutputs.map((output, index) => {
      return `${index + 1}. ${output}`
    }).join('\n\n')

    return await this.gpt3.predict({ prompt: joinedOutputNumbered })
  }
}

export default Describe
