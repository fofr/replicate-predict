async function runInstance(instance, options) {
  if (options.unnamedArg0 && (options.unnamedArg0.toLowerCase() === '-a' || options.unnamedArg0.toLowerCase() === '--all')) {
    return await instance.runAll()
  } else {
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
    return await instance.predict(predictOptions)
  }
}

export { runInstance }
