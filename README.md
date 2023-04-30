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
cd replicate-predict
npm install
```

Rename `.env.example` as `.env` and add your Replicate API token.

## Usage

```sh
node index.js <model_name> <option> [--<option_name> <option_value>]*
```

`model_name`: The name of the model you want to use (bark, kandinsky, or stablelm).
`option`: Either -a, --all, or a model’s default input, such as `prompt` or `image`.

### Examples

```sh
node index.js bark "this world"
node index.js bark --prompt "this world"
node index.js bark --all # inputs/bark-prompts.txt
node index.js bark "this world" --history_prompt en_speaker_1

node index.js kandinsky "picture of a cat" --steps 30
node index.js stablelm "What is the capital of France?"
```
