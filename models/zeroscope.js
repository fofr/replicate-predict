import ReplicateModel from '../lib/replicate-model.js'

class ZeroScope extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    num_frames: 24,
    fps: 24,
    width: 1024,
    height: 576,
    guidance_scale: 17.5,
    num_inference_steps: 50,
    negative_prompt: 'noisy, washed out, ugly, distorted, low quality, garish'
  }) {
    super(replicate, defaultInputs)
    this.user = 'anotherjesse'
    this.model = 'zeroscope-v2-xl'
    this.version = '8ba52bde11300615f65e9591d7afc58816def12c93c870fa583ff67ae17afdda'
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
