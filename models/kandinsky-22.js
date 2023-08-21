import ReplicateModel from '../lib/replicate-model.js'

class Kandinsky22 extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    num_outputs: 1,
    width: 2048,
    height: 2048,
    negative_prompt: 'vignette, garish, gaudy, psychedelic, high contrast, low quality, distorted, ugly'
  }) {
    super(replicate, defaultInputs)
    this.user = 'cjwbw'
    this.modelName = 'kandinsky-2.2'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFilesUsingCurl(prediction, `${fileNameBase}.png`)
    await this.saveInputAndPrediction(input, prediction, `${fileNameBase}.txt`)
  }
}

export default Kandinsky22
