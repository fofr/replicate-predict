import Replicate from 'replicate'
import * as dotenv from 'dotenv'
import loadModels from './models.js'

dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

async function main () {
  const models = await loadModels()
  const modelName = process.argv[2]
  const option = process.argv[3]

  if (!modelName || !option) {
    console.log('Usage: node index.js <model_name> <option> [<prompt>]')
    console.log('Options: -a, --all, <prompt>')
    process.exit(1)
  }

  const ModelClass = models[modelName.toLowerCase()]

  if (!ModelClass) {
    console.log('Invalid model name. Available models:', Object.keys(models).join(', '))
    process.exit(1)
  }

  const modelInstance = new ModelClass(replicate)

  if (option.toLowerCase() === '-a' || option.toLowerCase() === '--all') {
    await modelInstance.runAll()
    console.log(`${modelName.charAt(0).toUpperCase() + modelName.slice(1)}: Done`)
  } else {
    const prompt = option
    const result = await modelInstance.predict({ prompt })
    console.log('Prediction:', result)
    console.log('Done')
  }
}

main()
