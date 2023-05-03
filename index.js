import Replicate from 'replicate'
import { config } from 'dotenv'
import { loadModels, loadWorkflows } from './loader.js'
import { parseArgs } from './lib/arg-parser.js'

config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

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
  const InstanceClass = ModelClass || WorkflowClass

  if (!InstanceClass) {
    console.log('Invalid model or workflow name. Available models:', Object.keys(models).join(', '))
    console.log('Available workflows:', Object.keys(workflows).join(', '))
    process.exit(1)
  }

  const instance = new InstanceClass(replicate)

  if (options.unnamedArg0 && (options.unnamedArg0.toLowerCase() === '-a' || options.unnamedArg0.toLowerCase() === '--all')) {
    await instance.runAll()
    console.log(`${modelName.charAt(0).toUpperCase() + modelName.slice(1)}: Done`)
  } else {
    const inputKey = instance.defaultSingleInputName
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

    const result = await instance.predict(predictOptions)
    console.log('Result: ', result)
  }
}

main()
