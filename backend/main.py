from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from llm_client import get_feedback

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/feedback")
async def feedback(file: UploadFile = File(...)):
    contents = await file.read()
    # In a real scenario, we might validate image content here.
    feedback_text = get_feedback(contents)
    return {"feedback": feedback_text}