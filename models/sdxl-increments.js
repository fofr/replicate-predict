import ReplicateModel from '../lib/replicate-model.js'

class SDXLIncrements extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    seed: 1000,
    width: 1024,
    height: 1024,
    num_inference_steps: 50,
    guidance_scale: 7.5,
    num_outputs: 1,
    enable_safety_checker: false,
    prompt: 'A studio portrait photo of a cat',
    negative_prompt: 'ugly, soft, blurry, out of focus, low quality, garish, distorted, disfigured'
  }) {
    super(replicate, defaultInputs)
    this.user = 'replicate-internal'
    this.model = 'sdxl'
    this.version = '1f7611d83a8f7789159583ef2b8577570a595c402c977fada0b46161e088944f'
  }

  async runAll () {
    await this.predictMany()
  }

  async predictMany (_inputs = [], poolLimit = 10) {
    const schedulers = [
      'DDIM',
      'DPMSolverMultistep',
      'HeunDiscrete',
      'KarrasDPM',
      'K_EULER_ANCESTRAL',
      'K_EULER',
      'PNDM'
    ]

    // create an array from 1.1 to 20.0 with increments of 1
    const guidanceScales = Array.from(Array(19).keys()).map(i => i + 2)

    // create an array from 5 to 50 with 1 increments
    const numInferenceSteps = Array.from(Array(50).keys()).map(i => i + 1)

    // create an array combining all possible guidance scales and num inference steps
    const allInputs = []
    schedulers.forEach(scheduler => {
      guidanceScales.forEach(guidanceScale => {
        numInferenceSteps.forEach(numInferenceStep => {
          allInputs.push({
            scheduler,
            guidance_scale: guidanceScale,
            num_inference_steps: numInferenceStep
          })
        })
      })
    })

    return await super.predictMany(allInputs, poolLimit)
  }

  // 0 pad numbers
  pad (num, size) {
    let s = num + ''
    while (s.length < size) s = '0' + s
    return s
  }

  generateFileName (input) {
    return `${input.seed}-${input.scheduler}-${this.pad(input.guidance_scale * 10, 3)}-${this.pad(input.num_inference_steps, 3)}`
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input)
    await this.saveFileUsingCurl(prediction, `${fileNameBase}.png`)
    await this.convertFileToWebp(`${fileNameBase}.png`)
    await this.saveInputAndPrediction(input, prediction, `${fileNameBase}.txt`)
  }
}

export default SDXLIncrements
