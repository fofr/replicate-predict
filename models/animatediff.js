import ReplicateModel from '../lib/replicate-model.js'

class AnimateDiff extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    seed: 0,
    steps: 25,
    guidance_scale: 7.5,
    motion_module: 'mm_sd_v15',
    negative_prompt: 'ugly, broken, distorted, garish',
    path: 'realisticVisionV40_v20Novae.safetensors'
  }) {
    super(replicate, defaultInputs)
    this.user = 'lucataco'
    this.modelName = 'animate-diff'
  }
}

export default AnimateDiff
