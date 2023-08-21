import ReplicateModel from '../lib/replicate-model.js'

class SDXL extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    num_outputs: 1,
    width: 2048,
    height: 1024,
    refine: 'expert_ensemble_refiner',
    high_noise_frac: 0.8,
    negative_prompt: 'soft, blurry, ugly, broken, distorted, garish'
  }) {
    super(replicate, defaultInputs)
    this.user = 'stability-ai'
    this.modelName = 'sdxl'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFilesUsingCurl(prediction, `${fileNameBase}.png`)
    await this.saveInputAndPrediction(input, prediction, `${fileNameBase}.txt`)
  }
}

export default SDXL
