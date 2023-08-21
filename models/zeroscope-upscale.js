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
    this.version = '71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f'
    this.defaultSingleInputName = 'init_video'
  }

  async predict (input) {
    if (input.init_video) {
      input.init_video = await this.loadImageAsDataURI(input.init_video)
    }
    return await super.predict(input)
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.mp4`)
    await this.saveInputAndPrediction(input, prediction, `${fileNameBase}.txt`)
  }
}

export default ZeroScopeUpscale
