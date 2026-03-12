This project is a web application that detects tomato leaf diseases using a deep learning model (ResNet18) and provides treatment suggestions using an AI agent.

## Features

- Upload a tomato leaf image
- AI model predicts the disease
- Displays confidence score
- Shows prediction status (success / uncertain / failure)
- AI agent suggests treatment solutions

## Technologies

- Python
- Flask
- PyTorch
- ResNet18
- JavaScript
- OpenRouter AI agent

## How to Run

1. Clone the repository

git clone https://github.com/hmimou/tomato-disease-ai.git

2. Install dependencies

pip install -r requirements.txt

3. Add your API key

Create a `.env` file:

OPENROUTER_API_KEY=your_key

4. Run the application

python app.py

Then open:

http://127.0.0.1:5000
