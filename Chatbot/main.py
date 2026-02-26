import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from chain import chat_with_bot, embeddings, collection
import uvicorn

load_dotenv()

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Simplified for deployment flexibility
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class EmbedRequest(BaseModel):
    id: str
    title: str
    description: str
    bio: str
    tags: List[str]

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = chat_with_bot(request.message)
        return response
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        )

@app.post("/embed")
async def embed_course(request: EmbedRequest):
    try:
        text_to_embed = f"{request.title} {request.description} {request.bio} {' '.join(request.tags)}"
        vector = embeddings.embed_query(text_to_embed)
        
        collection.update_one(
            {"_id": request.id},
            {"$set": {
                "embedding": vector,
                "embedding_text": text_to_embed
            }},
            upsert=True
        )
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("CHATBOT_PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
