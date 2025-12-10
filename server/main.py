from google import genai
from google.genai import types
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import shutil
import time
import json
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError ("No Gemini API key found")

client = genai.Client(api_key = GEMINI_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """
You are an expert instructional coach. Analyze this classroom audio.
Identify 3 distinct pedagogical moments (Positive or Needs Improvement).
Return the result ONLY as a JSON object with this structure:
{
  "feedback": [
    {
      "timestamp": "MM:SS",
      "principle": "Short Title",
      "description": "1 sentence explanation."
    }
  ]
}
Do not use markdown. Return raw JSON.
"""

@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    temp_filename = f"temp_{file.filename}"

    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        uploaded_file = client.files.upload(file=temp_filename)

        while uploaded_file.state == "PROCESSING" :
            time.sleep(2)
            uploaded_file = client.files.get(name=uploaded_file.name)

        if not uploaded_file.state == "ACTIVE": # found that state was an enum in google ai docs ,it can also be "FAILED" | "STATE_UNSPECIFIED"
            raise HTTPException(status_code=500, detail="gemini failed")

        response = client.models.generate_content(
            model = "gemini-2.5-flash",
            contents = [uploaded_file, "Analyze this audio"],
            config = types.GenerateContentConfig(
                system_instruction = SYSTEM_PROMPT,
                response_mime_type="application/json"
            )
        )
        return JSONResponse(content= json.loads(response.text))
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
