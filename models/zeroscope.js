import ReplicateModel from '../lib/replicate-model.js'

class ZeroScope extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    num_frames: 24,
    fps: 24,
    width: 1024,
    height: 576,
    guidance_scale: 12.5,
    num_inference_steps: 50,
    negative_prompt: 'noisy, washed out, ugly, distorted, low quality, garish',
    model: 'xl'
  }) {
    super(replicate, defaultInputs)
    this.user = 'anotherjesse'
    this.model = 'zeroscope-v2-xl'
    this.version = 'dcad8a883c2e99e3bf1d88590ce070bc6dd4e498af14a3f2f6e437f0f1ba7adb'
  }

  async predict (input) {
    input.prompt = `${input.prompt}, 8k, beautiful, award winning`
    return await super.predict(input)
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.mp4`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default ZeroScope
