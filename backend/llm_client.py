import os
import base64
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

def encode_image_to_base64(image_bytes):
    return base64.b64encode(image_bytes).decode('utf-8')

def get_feedback(image_bytes):
    base64_image = encode_image_to_base64(image_bytes)
    
    messages = [
        {
            "role": "system",
            "content": "You are an experienced art instructor focusing on basic anatomy and perspective for aspiring comic book artists. Provide detailed, constructive, encouraging feedback on artwork."
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please review this drawing and provide specific, constructive feedback about the anatomy and perspective. Focus on 3-4 key areas for improvement if there are any while also mentioning what works well."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                }
            ]
        }
    ]
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=2000,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error: {e}")
        return "Sorry, there was an error processing your request."