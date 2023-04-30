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

## Usage

```sh
node index.js <model_name> <option> [<prompt>]
```

`model_name`: The name of the model you want to use (bark, kandinsky, or stablelm).
`option`: Either -a, --all, or a custom `prompt` for the model.
`prompt`: An optional custom prompt for the model. This argument should be provided if the `option` is not -a or --all.

### Examples

```sh
node index.js bark "hello there, this is a test"
node index.js kandinsky "picture of a cat"
node index.js stablelm "What is the capital of France?"
node index.js bark --all # inputs/bark-prompts.txt
```
