async function runInstance (instance, options) {
  if (options.unnamedArg0 && (options.unnamedArg0.toLowerCase() === '-a' || options.unnamedArg0.toLowerCase() === '--all')) {
    return await instance.runAll()
  } else {
    let count = 1
    if (options['-c'] || options['--count']) {
      count = options['-c'] || options['--count']
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
    delete predictOptions['-c']
    delete predictOptions['--count']

    if (count === 1) {
      return await instance.predict(predictOptions)
    }

    const inputs = new Array(count).fill(predictOptions)
    return await instance.predictMany(inputs)
  }
}

export { runInstance }
