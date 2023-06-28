import ZeroScopeUpscale from '../models/zeroscope-upscale.js'
import ReplicateModel from '../lib/replicate-model.js'

class DoubleUpscale extends ReplicateModel {
  constructor (replicate, defaultInputs = {}) {
    super(replicate, defaultInputs)
    this.defaultSingleInputName = 'url'
    this.zeroscope = new ZeroScopeUpscale(this.replicate)
  }

  async predict (input) {
    const zOutput = await this.zeroscope.predict({ init_video: input.url })
    if (zOutput && zOutput[0]) {
      await this.zeroscope.predict({ init_video: zOutput[0] })
    }
  }
}

export default DoubleUpscale
