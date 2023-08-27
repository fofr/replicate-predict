const convertValue = (value) => {
  if (value.toLowerCase() === 'true') return true
  if (value.toLowerCase() === 'false') return false

  if (!isNaN(value) && value.trim() !== '') {
    const parsedValue = parseFloat(value)
    return Number.isInteger(parsedValue) ? parseInt(value) : parsedValue
  }
  return value
}

const parseArgs = (args) => {
  const options = {}
  let unnamedArgIndex = 0
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      options[args[i].slice(2)] = convertValue(args[++i])
    } else {
      options[`unnamedArg${unnamedArgIndex++}`] = convertValue(args[i])
    }
  }
  return options
}

export { parseArgs }
