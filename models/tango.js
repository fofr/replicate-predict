import ReplicateModel from '../lib/replicate-model.js'

class Tango extends ReplicateModel {
  constructor (replicate, defaultInputs = {
    steps: 100,
    guidance: 3
  }) {
    super(replicate, defaultInputs)
    this.user = 'cjwbw'
    this.modelName = 'tango'
  }
}

export default Tango
