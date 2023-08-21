const runInstance = async (instance, options) => {
  if (options.unnamedArg0 && (options.unnamedArg0.toLowerCase() === '-a' || options.unnamedArg0.toLowerCase() === '--all')) {
    const predictOptions = { ...options }
    delete predictOptions.unnamedArg0

    return await instance.predictFromFile(predictOptions)
  } else {
    let count = 1
    if (options.count) {
      count = options.count
      delete options.count
    }

    const inputKey = instance.defaultSingleInputName
    const input = options[inputKey] || options.unnamedArg0

    if (!input) {
      throw new Error(`Missing input for ${inputKey}.`)
    }

    const predictOptions = {
      [inputKey]: input,
      ...options
    }
    delete predictOptions.unnamedArg0

    if (count === 1) {
      return await instance.predict(predictOptions)
    }

    const inputs = new Array(count).fill(predictOptions)
    return await instance.predictMany(inputs)
  }
}

export { runInstance }
