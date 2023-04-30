import Replicate from 'replicate'
import * as dotenv from 'dotenv'
import Bark from './models/bark.js'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const bark = new Bark(replicate)
bark.runAll().then(() => {
  console.log("Done")
})
