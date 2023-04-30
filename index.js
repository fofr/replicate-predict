import Replicate from 'replicate'
import * as dotenv from 'dotenv'
import Kandinsky from './models/kandinsky.js'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const k = new Kandinsky(replicate)
k.runAll().then(() => {
  console.log("Done")
})
