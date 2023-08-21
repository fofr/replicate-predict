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
    this.version = '80850e3b23b7d1b0abe695602ba87ce9913dcd1a5c534e161edab627a9f29c71'
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFilesUsingCurl(prediction, `${fileNameBase}.png`)
    await this.saveInputAndPrediction(input, prediction, `${fileNameBase}.txt`)
  }
}

export default Kandinsky22
