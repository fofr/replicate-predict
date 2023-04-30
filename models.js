import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function loadModels () {
  const modelsDirectory = path.join(__dirname, 'models')
  const modelFiles = fs.readdirSync(modelsDirectory).filter(file => file.endsWith('.js'))

  const models = {}
  for (const file of modelFiles) {
    const modelName = path.basename(file, '.js')
    const modelClass = await import(path.join(modelsDirectory, file))
    models[modelName] = modelClass.default
  }

  return models
}

export default loadModels
