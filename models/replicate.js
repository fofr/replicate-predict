import ReplicateModel from '../lib/replicate-model.js'

class Replicate extends ReplicateModel {
  constructor (replicate, { defaultInputs, user, modelName }) {
    super(replicate, defaultInputs)
    this.user = user
    this.modelName = modelName
  }
}

export default Replicate
