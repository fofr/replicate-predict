import ReplicateModel from '../lib/replicate-model.js'

class SDXLBarbie extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    num_outputs: 4,
    width: 1360,
    height: 768,
    scheduler: 'K_EULER_ANCESTRAL',
    refine: 'expert_ensemble_refiner',
    high_noise_frac: 0.95,
    apply_watermark: false,
    lora_scale: 0.6,
    negative_prompt: 'ugly, broken, distorted, low quality, deformed, disfigured'
  }) {
    super(replicate, defaultInputs)
    this.user = 'fofr'
    this.modelName = 'sdxl-barbie'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFilesUsingCurl(prediction, `${fileNameBase}.png`)
    await this.saveInputAndPrediction(input, prediction, `${fileNameBase}.txt`)
  }
}

export default SDXLBarbie
