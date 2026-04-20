import os
import requests
from dotenv import load_dotenv

load_dotenv()

class OpenAIAPI:
    @staticmethod
    def generate_response(user_message, conversation_history=None):
        if conversation_history is None:
            conversation_history = []

        # 1. Get your free key from https://console.groq.com
        api_key = os.environ.get('GROQ_API_KEY') 
        
        # 2. Change the endpoint to Groq
        endpoint = "https://api.groq.com/openai/v1/chat/completions"
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        messages = conversation_history + [{"role": "user", "content": user_message}]
        
        payload = {
            # 3. Use a free model (llama-3.1-8b-instant is very fast and free)
            "model": "llama-3.1-8b-instant", 
            "messages": messages,
            "max_tokens": 150
        }
        
        try:
            response = requests.post(endpoint, headers=headers, json=payload)
            response_data = response.json()
            
            if 'choices' in response_data and len(response_data['choices']) > 0:
                return response_data['choices'][0]['message']['content']
            else:
                print(f"Error from API: {response_data}")
                return "Error: Check your API key or rate limits."
        except Exception as e:
            print(f"Error calling API: {e}")
            return "Sorry, something went wrong."