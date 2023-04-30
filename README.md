# Replicate predict

A wrapper library to make running parallel API calls to Replicate models easier.

- put prompts in a text file in an `inputs` directory
- save outputs using curl to an `outputs` directory

## Requirements

You need:

- An account on Replicate
- Your Replicate API token

## Installation

```sh
git clone https://github.com/fofr/replicate-predict
cd replicate-predice
npm install
```

Rename `.env.example` as `.env` and add your Replicate API token.

## Example usage

```js
import Replicate from 'replicate'
import * as dotenv from 'dotenv'
import Kandinsky from './models/kandinsky.js'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const k = new Kandinsky(replicate)
k.runAll().then(() => { console.log("Done") })
```

## Models

### Kandinsky

- Input: `inputs/kandinsky-prompts.txt`, one prompt per line
- Output: `outputs/kandinsky`, saves prompt as txt file alongside image

### Bark

- Input: `inputs/bark-prompts.txt`, multiline prompts separated with `---`
- Output: `outputs/bark`, saves prompt as txt file alongside audio file
