import Replicate from 'replicate'
import { config } from 'dotenv'
import { loadModels, loadWorkflows } from './loader.js'
import { parseArgs } from './lib/arg-parser.js'
import { runInstance } from './lib/run-instance.js'

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
    console.log('Options: -a, --all, <single_input_value>, -c <count>, --count <count>')
    console.log('Use -c or --count with a number to run predict that many times')
    process.exit(1)
  }

  const ModelClass = models[modelName.toLowerCase()]
  const WorkflowClass = workflows[modelName.toLowerCase()]
  const InstanceClass = ModelClass || WorkflowClass

  if (!InstanceClass) {
    console.log('Invalid model or workflow name. Available models: ', Object.keys(models).join(', '))
    console.log('Available workflows: ', Object.keys(workflows).join(', '))
    process.exit(1)
  }

  const instance = new InstanceClass(replicate)
  await instance.setModel()
  await instance.setOutputDirectory()

  try {
    const result = await runInstance(instance, options)
    console.log('Result: ', result)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

main()
