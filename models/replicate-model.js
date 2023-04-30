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

  async predictMany(inputs = [], poolLimit = 5) {
    return asyncPool(poolLimit, inputs, async input => {
      return await this.predict(input)
    })
  }
}

async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = []
  const executing = []

  for (const item of array) {
    const p = iteratorFn(item)
    ret.push(p)

    if (poolLimit <= array.length) {
      const e = p.finally(() => {
        executing.splice(executing.indexOf(e), 1)
      })
      executing.push(e)
      if (executing.length >= poolLimit) {
        await Promise.race(executing)
      }
    }
  }

  return Promise.all(ret)
}

export default ReplicateModel
