import Replicate from 'replicate'
import * as dotenv from 'dotenv'
import { loadModels, loadWorkflows } from './loader.js'

dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

const convertValue = (value) => {
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

async function main () {
  const models = await loadModels()
  const workflows = await loadWorkflows()

  const modelName = process.argv[2]
  const args = process.argv.slice(3)
  const options = parseArgs(args)

  if (!modelName || Object.keys(options).length === 0) {
    console.log('Usage: node index.js <model_name> <option> [--<option_name> <option_value>]*')
    console.log('Options: -a, --all, <single_input_value>')
    process.exit(1)
  }

  const ModelClass = models[modelName.toLowerCase()]
  const WorkflowClass = workflows[modelName.toLowerCase()]

  if (!ModelClass && !WorkflowClass) {
    console.log('Invalid model or workflow name. Available models:', Object.keys(models).join(', '))
    console.log('Available workflows:', Object.keys(workflows).join(', '))
    process.exit(1)
  }

  if (ModelClass) {
    const modelInstance = new ModelClass(replicate)

    if (options.unnamedArg0 && (options.unnamedArg0.toLowerCase() === '-a' || options.unnamedArg0.toLowerCase() === '--all')) {
      await modelInstance.runAll()
      console.log(`${modelName.charAt(0).toUpperCase() + modelName.slice(1)}: Done`)
    } else {
      const inputKey = modelInstance.defaultSingleInputName
      const input = options[inputKey] || options.unnamedArg0

      if (!input) {
        console.log(`Missing input for ${inputKey}.`)
        process.exit(1)
      }

      const predictOptions = {
        [inputKey]: input,
        ...options
      }
      delete predictOptions.unnamedArg0

      const result = await modelInstance.predict(predictOptions)
      console.log('Prediction:', result)
      console.log('Done')
    }
  } else if (WorkflowClass) {
    const workflowInstance = new WorkflowClass(replicate)

    if (options.unnamedArg0 && (options.unnamedArg0.toLowerCase() === '-a' || options.unnamedArg0.toLowerCase() === '--all')) {
      await workflowInstance.runAll()
      console.log(`${modelName.charAt(0).toUpperCase() + modelName.slice(1)}: Done`)
    } else {
      const inputKey = workflowInstance.defaultSingleInputName
      const input = options[inputKey] || options.unnamedArg0

      if (!input) {
        console.log(`Missing input for ${inputKey}.`)
        process.exit(1)
      }

      const predictOptions = {
        [inputKey]: input,
        ...options
      }
      delete predictOptions.unnamedArg0

      const result = await workflowInstance.predict(predictOptions)
      console.log('Workflow result:', result)
      console.log('Done')
    }
  }
}

main()
