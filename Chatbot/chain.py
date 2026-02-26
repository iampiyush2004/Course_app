import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo import MongoClient

load_dotenv()

# Configuration
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = "course_selling_app"
COLLECTION_NAME = "courses"
ATLAS_VECTOR_SEARCH_INDEX_NAME = "course_vector_index"

client = MongoClient(MONGODB_URI)
collection = client[DB_NAME][COLLECTION_NAME]

embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

vector_search = MongoDBAtlasVectorSearch(
    collection=collection,
    embedding=embeddings,
    index_name=ATLAS_VECTOR_SEARCH_INDEX_NAME,
    text_key="embedding_text",  # We will store concatenated text here
    embedding_key="embedding",
)

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0)

def get_recommendations(query):
    # Perform vector search
    results = vector_search.similarity_search_with_score(query, k=10)
    
    # Process results: calculate rating and sort
    processed_results = []
    for doc, score in results:
        total_stars = doc.metadata.get("totalStars", 0)
        total_reviews = doc.metadata.get("totalReviews", 0)
        avg_rating = total_stars / total_reviews if total_reviews > 0 else 0
        
        processed_results.append({
            "id": str(doc.metadata.get("_id")),
            "title": doc.metadata.get("title"),
            "description": doc.metadata.get("description"),
            "price": doc.metadata.get("price"),
            "imageLink": doc.metadata.get("imageLink"),
            "rating": avg_rating,
            "totalReviews": total_reviews,
            "score": score
        })
    
    # Sort by rating (descending)
    processed_results.sort(key=lambda x: x["rating"], reverse=True)
    
    # Take top 5
    return processed_results[:5]

def chat_with_bot(user_message):
    # 1. Identify intent and extract topics using LLM
    prompt = f"""
    You are a course recommendation assistant for a platform called UPSKILL.
    The user is asking: "{user_message}"
    
    Your goal is to identify if the user is looking for course recommendations.
    If yes, extract the topics they are interested in.
    If no, just respond politely and say you can help them find courses.
    
    Response format (JSON):
    {{
        "intent_is_recommendation": boolean,
        "search_query": "string (optimized for semantic search over course descriptions)",
        "reply": "string (your friendly message to the user)"
    }}
    """
    
    response = llm.invoke(prompt)
    import json
    try:
        # Handling potential markdown formatting in response
        content = response.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        data = json.loads(content)
    except:
        return {"reply": "Sorry, I'm having trouble understanding. Could you try rephrasing?", "courses": []}

    if data["intent_is_recommendation"]:
        courses = get_recommendations(data["search_query"])
        return {{
            "reply": data["reply"],
            "courses": courses
        }}
    else:
        return {{
            "reply": data["reply"],
            "courses": []
        }}
