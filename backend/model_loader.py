import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_ID = os.environ.get(
    "HF_MODEL_ID",
    "BSVGK/gemma-1.1-2b-it-drugbank-kg2text-lora_v1"
)

tokenizer = None
model = None


def load_model():
    global tokenizer, model

    if tokenizer is not None and model is not None:
        return tokenizer, model

    torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

    tokenizer = AutoTokenizer.from_pretrained(
        MODEL_ID,
        extra_special_tokens={},
        trust_remote_code=True
)

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        dtype=torch_dtype,
        device_map="auto"
    )

    model.eval()

    return tokenizer, model


def generate_with_model(
    prompt: str,
    max_new_tokens: int = 260,
    min_new_tokens: int = 1,
    temperature: float = 0.0,
    top_p: float = 0.95,
    repetition_penalty: float = 1.05,
    stop_at_end_turn: bool = True
) -> str:
    tokenizer, model = load_model()

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=2048
    )
    inputs = {k: v.to(model.device) for k, v in inputs.items()}

    end_turn_ids = tokenizer.encode("<end_of_turn>", add_special_tokens=False)
    end_turn_id = end_turn_ids[0] if len(end_turn_ids) > 0 else tokenizer.eos_token_id

    do_sample = temperature > 0.0

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=int(max_new_tokens),
            min_new_tokens=int(min_new_tokens),
            do_sample=do_sample,
            temperature=float(temperature) if do_sample else 1.0,
            top_p=float(top_p),
            repetition_penalty=float(repetition_penalty),
            pad_token_id=tokenizer.pad_token_id,
            eos_token_id=end_turn_id if stop_at_end_turn else tokenizer.eos_token_id
        )

    decoded = tokenizer.decode(outputs[0], skip_special_tokens=False)

    if "<start_of_turn>model" in decoded:
        decoded = decoded.split("<start_of_turn>model", 1)[1]

    if stop_at_end_turn and "<end_of_turn>" in decoded:
        decoded = decoded.split("<end_of_turn>", 1)[0]

    return decoded.strip()