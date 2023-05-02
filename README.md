# Replicate predict

A wrapper library to make running parallel API calls to Replicate models easier.

- command line models and params
- batch process prompts in a text file in an `inputs` directory
- automaticall save outputs (alongside params) using curl to an `outputs` directory

[See supported models](https://github.com/fofr/replicate-predict/tree/main/models)

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
node index.js modelscope "video of a bear"
node index.js esrgan https://pbs.twimg.com/profile_images/1592472040992284674/oo_p8ahp_400x400.jpg
```

### Example LLM output

```sh
node index.js stablelm "What is the capital of France? Have there ever been other capitals?"
```

Gives the file `outputs/stablelm/[timestamp]_What_is_the_capital_of_France.txt` with the content:

```
What is the capital of France? Have there ever been other capitals?
---
The city where Napoleon Bonaparte was born is called Bordeaux. However, it’s unlikely you want me to answer this question directly without knowing what kind of “capital” means – I think we might need clarification on your definition! If you can clarify what sort of capital would you like to know about, then I can try my best to give you some useful info based on historical facts or official documents from time periods when each type of location had something unique within its jurisdiction …
```
