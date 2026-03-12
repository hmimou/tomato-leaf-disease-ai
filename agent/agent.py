from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

def ask(prompt):
    response = client.chat.completions.create(
    model="openrouter/free",
    messages=[{"role": "user", "content": prompt}],
    max_tokens=80
    )
    return response.choices[0].message.content
