const cleanup = (options) => {
  const cleanedOptions = { ...options }
  delete cleanedOptions.unnamedArg0
  delete cleanedOptions.count
  return cleanedOptions
}

const isRunAll = (options) => {
  return options.unnamedArg0 &&
    (options.unnamedArg0.toLowerCase() === '-a' ||
    options.unnamedArg0.toLowerCase() === '--all')
}

const runInstance = async (instance, options) => {
  if (isRunAll(options)) {
    return await instance.predictFromFile(cleanup({ ...options }))
  } else {
    const count = options.count || 1
    const inputKey = instance.defaultSingleInputName
    const input = options[inputKey] || options.unnamedArg0

    if (!input) {
      throw new Error(`Missing input for ${inputKey}.`)
    }

    const predictOptions = cleanup({
      [inputKey]: input,
      ...options
    })

    if (count === 1) {
      return await instance.predict(predictOptions)
    }

    const inputs = new Array(count).fill(predictOptions)
    return await instance.predictMany(inputs)
  }
}

export { runInstance }
