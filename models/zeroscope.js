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
    this.modelName = 'zeroscope-v2-xl'
  }
}

export default ZeroScope
