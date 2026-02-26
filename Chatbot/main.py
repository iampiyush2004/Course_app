import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from chain import chat_with_bot, embeddings, collection
import uvicorn

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        print(f"Received message: {request.message}")
        response = chat_with_bot(request.message)
        print(f"Bot response: {response}")
        return response
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

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
