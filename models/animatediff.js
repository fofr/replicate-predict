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
    this.model = 'animate-diff'
    this.version = '1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFilesUsingCurl(prediction, `${fileNameBase}.mp4`)
    await this.saveInputAndPrediction(input, prediction, `${fileNameBase}.txt`)
  }
}

export default AnimateDiff
