import ReplicateModel from './replicate-model.js'

class Kandinsky extends ReplicateModel {
  constructor(replicate, defaulInputs) {
    super(replicate, defaulInputs)

    this.user = 'ai-forever'
    this.model = 'kandinsky-2'
    this.version = '601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f'
    this.inputFilePath = 'inputs/kandinsky-prompts.txt'
    this.outputDirectory = 'outputs/kandinsky'
  }

  async saveOutputs(prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    await this.saveFileUsingCurl(prediction[0], `${fileNameBase}.png`)
    await this.savePrompt(input.prompt, `${fileNameBase}.txt`)
  }
}

export default Kandinsky