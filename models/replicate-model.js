class ReplicateModel {
  constructor(replicate) {
    this.replicate = replicate
  }

  async predict(input) {
    if (!this.identifier) {
      throw new Error('Identifier must be defined in the derived class.')
    }

    console.log('Running', this.constructor.name, input)
    return await this.replicate.run(this.identifier, { input })
  }
}

export default ReplicateModel
