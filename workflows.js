import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function loadWorkflows () {
  const workflowsDirectory = path.join(__dirname, 'workflows')
  const workflowFiles = fs.readdirSync(workflowsDirectory).filter(file => file.endsWith('.js'))

  const models = {}
  for (const file of modelFiles) {
    const modelName = path.basename(file, '.js')
    const modelClass = await import(path.join(workflowsDirectory, file))
    models[modelName] = modelClass.default
  }

  return models
}

export default loadWorkflows
