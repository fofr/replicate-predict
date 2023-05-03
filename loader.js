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

async function loadWorkflows () {
  const workflowsDirectory = path.join(__dirname, 'workflows')
  const workflowFiles = fs.readdirSync(workflowsDirectory).filter(file => file.endsWith('.js'))

  const workflows = {}
  for (const file of workflowFiles) {
    const workflowName = path.basename(file, '.js')
    const workflowClass = await import(path.join(workflowsDirectory, file))
    workflows[workflowName] = workflowClass.default
  }

  return workflows
}

export { loadModels, loadWorkflows }
