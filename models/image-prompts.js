import ReplicateModel from '../lib/replicate-model.js'

class ImagePrompts extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    max_length: 100,
    temperature: 1,
    top_p: 1,
    repetition_penalty: 1.5
  }) {
    super(replicate, defaultInputs)
    this.user = 'fofr'
    this.model = 'image-prompts'
    this.version = 'ba4130c13f3f1cd9771bc671bb13eab6ad5d839b2e55723b40742c03ef7f99ff'
  }

  async predict (input) {
    return await super.predict({ prompt: `Image: ${input.prompt}` })
  }

  output (prediction) {
    let imagePrompt = prediction.join('').replace(/--ar.*$/m, '')
    imagePrompt = imagePrompt.includes('Prompt: ') ? imagePrompt.split('Prompt: ')[1] : imagePrompt
    return imagePrompt
  }

  async saveOutputs (prediction, input) {
    const fileNameBase = this.generateFileName(input.prompt)
    const text =
`${input.prompt}
---
${this.output(prediction)}`
    await this.saveFile(text, `${fileNameBase}.txt`)
  }
}

export default ImagePrompts
