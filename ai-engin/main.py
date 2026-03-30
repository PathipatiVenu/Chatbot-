import uvicorn
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from rag_logic import InterviewEngine

app = FastAPI()

# Initialize Engine
try:
    engine = InterviewEngine()
except Exception as e:
    print(f"🔥 Startup Error: {e}")
    engine = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(data: dict = Body(...)):
    if not engine:
        raise HTTPException(status_code=500, detail="AI Engine failed to start.")
    
    try:
        question = engine.generate_question(
            jd=data.get("jd", ""), 
            self_intro=data.get("self_intro", ""), 
            history=data.get("history", "")
        )
        return {"question": question}
    except Exception as e:
        print(f"❌ API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/score")
async def score(data: dict = Body(...)):
    try:
        report = engine.analyze_final_score(data.get("history", ""))
        return {"report": report}
    except Exception as e:
        print(f"❌ Score Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)