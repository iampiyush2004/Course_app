import os
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from tqdm import tqdm

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = "course_selling_app"
COLLECTION_NAME = "courses"

client = MongoClient(MONGODB_URI)
collection = client[DB_NAME][COLLECTION_NAME]
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001", output_dimensionality=768)

def index_existing_courses():
    courses = list(collection.find({}))
    print(f"Found {len(courses)} courses to index.")
    
    for course in tqdm(courses):
        title = course.get("title", "")
        description = course.get("description", "")
        bio = course.get("bio", "")
        tags = course.get("tags", [])
        
        text_to_embed = f"{title} {description} {bio} {' '.join(tags)}"
        
        try:
            vector = embeddings.embed_query(text_to_embed)
            collection.update_one(
                {"_id": course["_id"]},
                {"$set": {
                    "embedding": vector,
                    "embedding_text": text_to_embed
                }}
            )
        except Exception as e:
            print(f"Error indexing course {course.get('_id')}: {e}")

if __name__ == "__main__":
    index_existing_courses()
    print("Indexing complete.")
