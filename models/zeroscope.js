import ReplicateModel from '../lib/replicate-model.js'

class ZeroScope extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    num_frames: 24,
    fps: 8,
    width: 576,
    height: 320,
    guidance_scale: 12.5,
    num_inference_steps: 50,
    model: '576w',
    negative_prompt: 'noisy, washed out, ugly, distorted, low quality, garish'
  }) {
    super(replicate, defaultInputs)
    this.user = 'anotherjesse'
    this.model = 'zeroscope-v2-xl'
    this.version = '71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f'
  }

  async predict (input) {
    input.prompt = `${input.prompt}, 8k, beautiful, award winning`
    return await super.predict(input)
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFilesUsingCurl(prediction, `${fileNameBase}.mp4`)
    await this.saveInputAndPrediction(input, prediction, `${fileNameBase}.txt`)
  }
}

export default ZeroScope
