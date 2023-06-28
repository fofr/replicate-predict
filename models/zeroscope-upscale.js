import ReplicateModel from '../lib/replicate-model.js'

class ZeroScopeUpscale extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    num_frames: 24,
    fps: 24,
    width: 1024,
    height: 576,
    guidance_scale: 12.5,
    num_inference_steps: 50,
    model: 'xl',
    init_weight: 0.25,
    prompt: 'detailed, 8k, beautiful',
    negative_prompt: 'noisy, washed out, ugly, distorted, low quality, garish'
  }) {
    super(replicate, defaultInputs)
    this.user = 'anotherjesse'
    this.model = 'zeroscope-v2-xl'
    this.version = 'dcad8a883c2e99e3bf1d88590ce070bc6dd4e498af14a3f2f6e437f0f1ba7adb'
    this.defaultSingleInputName = 'init_video'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.mp4`)
    await this.saveInputAndPrediction(input, prediction, `${fileNameBase}.txt`)
  }
}

export default ZeroScopeUpscale
