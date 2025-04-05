from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import google.generativeai as genai

from fastapi import FastAPI, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import bcrypt

app = FastAPI()

# Enable CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URI = "mongodb://localhost:27017"  # Change for MongoDB Atlas
client = MongoClient(MONGO_URI)
db = client["sibi_db"]  # Database name
users_collection = db["users"]  # Collection name

# 🚀 User Signup
@app.post("/signup")
def signup(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    if users_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    user_data = {"username": username, "email": email, "password": hashed_password}
    users_collection.insert_one(user_data)
    
    return {"message": "Signup successful!"}

# 🚀 User Login
@app.post("/login")
def login(email: str = Form(...), password: str = Form(...)):
    user = users_collection.find_one({"email": email})

    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful!", "username": user["username"]}

# Initialize Groq API
client = Groq(api_key="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")  # Replace with actual API key

# Configure Gemini API (For OCR-based Answer Sheet Analysis)
genai.configure(api_key="AIzaSyC7kcDQFkHQTbJaJtj2JZ8zVaDHdA3Li-E")

@app.get("/")
def home():
    return {"message": "SIBI Backend Running"}

# 📖 AI Study Plan Generator
@app.get("/generate-study-plan")
def generate_study_plan(topic: str):
    messages = [{"role": "system", "content": "You are an AI that generates structured study plans."}]
    messages.append({"role": "user", "content": f"Create a study plan for {topic}."})

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=1,
        max_completion_tokens=1024,
        stream=False,
    )

    return {"study_plan": completion.choices[0].message.content}

# 📝 AI Quiz Generator
@app.get("/generate-quiz")
def generate_quiz(topic: str):
    messages = [{"role": "system", "content": "You are an AI quiz generator."}]
    messages.append({"role": "user", "content": f"Generate 5 multiple-choice quiz questions on {topic}."})

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=1,
        max_completion_tokens=1024,
        stream=False,
    )

    return {"quiz": completion.choices[0].message.content}

# 🤖 AI Chatbot for Study Assistance
@app.post("/chat")
def chat_with_ai(user_message: str = Form(...)):
    messages = [{"role": "system", "content": "You are an AI-powered study assistant."}]
    messages.append({"role": "user", "content": user_message})

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=1,
        max_completion_tokens=1024,
        stream=False,
    )

    return {"response": completion.choices[0].message.content}

# 📄 AI Answer Sheet Analysis (OCR + Feedback)
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from groq import Groq
from PIL import Image
import PyPDF2
import io



def extract_text(file: UploadFile):
    """Extract text from PDF, image, or text files."""
    filename = file.filename.lower()

    try:
        # Extract text from PDFs
        if filename.endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.file.read()))
            extracted_text = "\n".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])

        # Extract text from images using Gemini API
        elif filename.endswith((".png", ".jpg", ".jpeg")):
            image_data = file.file.read()
            response = genai.GenerativeModel("gemini-1.5-pro").generate_content(
                [image_data, "Extract text from this image."]
            )
            extracted_text = response.text if hasattr(response, "text") else "No text extracted"

        # Extract text from plain text files
        elif filename.endswith(".txt"):
            extracted_text = file.file.read().decode("utf-8")

        else:
            return "Unsupported file type. Please upload a PDF, image, or text file."

        return extracted_text

    except Exception as e:
        return f"Error extracting text: {e}"

@app.post("/analyze-answer-sheet")
async def analyze_answer_sheet(file: UploadFile = File(...)):
    """Extract text from answer sheet and provide AI-generated feedback."""
    extracted_text = extract_text(file)

    if not extracted_text:
        return {"error": "Failed to extract text. Please check your file."}

    # Send extracted text to Groq API (LLaMA 3.3) for evaluation
    messages = [
        {"role": "system", "content": "Analyze the answer sheet and provide feedback on mistakes and improvements."},
        {"role": "user", "content": f"Evaluate this answer sheet and suggest improvements: {extracted_text}"}
    ]

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=1,
        max_completion_tokens=1024,
        stream=False,
    )

    return {
        "extracted_text": extracted_text,
        "feedback": completion.choices[0].message.content
    }

