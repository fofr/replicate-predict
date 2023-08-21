import ReplicateModel from '../lib/replicate-model.js'

class Kandinsky extends ReplicateModel {
  constructor (replicate, defaultInputs) {
    super(replicate, defaultInputs)
    this.user = 'ai-forever'
    this.modelName = 'kandinsky-2'
  }

  output (prediction) {
    return prediction[0]
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction[0], `${fileNameBase}.png`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default Kandinsky
