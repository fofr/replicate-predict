import ReplicateModel from '../lib/replicate-model.js'

class ZeroScopeUpscale extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    num_frames: 24,
    width: 1024,
    height: 576,
    fps: 8,
    guidance_scale: 12.5,
    num_inference_steps: 50,
    model: 'xl',
    init_weight: 0.25,
    prompt: 'detailed, 8k, beautiful',
    negative_prompt: 'noisy, washed out, ugly, distorted, low quality, garish'
  }) {
    super(replicate, defaultInputs)
    this.user = 'anotherjesse'
    this.modelName = 'zeroscope-v2-xl'
    this.defaultSingleInputName = 'init_video'
  }

  async predict (input) {
    if (input.init_video) {
      input.init_video = await this.loadImageAsDataURI(input.init_video)
    }
    return await super.predict(input)
  }
}

export default ZeroScopeUpscale
