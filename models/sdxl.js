import ReplicateModel from '../lib/replicate-model.js'

class SDXL extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    num_outputs: 1,
    width: 1024,
    height: 1024,
    scheduler: 'K_EULER',
    refine: 'expert_ensemble_refiner',
    high_noise_frac: 0.8,
    negative_prompt: 'soft, blurry, ugly, broken, distorted, garish'
  }) {
    super(replicate, defaultInputs)
    this.user = 'stability-ai'
    this.modelName = 'sdxl'
  }
}

export default SDXL
