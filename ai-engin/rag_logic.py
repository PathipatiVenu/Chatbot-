import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()

class InterviewEngine:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("❌ ERROR: GOOGLE_API_KEY not found in .env")
            raise ValueError("Missing Gemini API Key")
        
        # Use Gemini 1.5 Flash - it's fast and has a huge free tier
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite", 
            google_api_key=api_key,
            temperature=0.7,
            # Ensure we don't hit the 404 by explicitly setting the version if needed
            # version="v1" 
        )
        print("✅ Gemini Free Tier Initialized (2.5 Flash-Lite)")
        self.context = self.load_all_csv_data()
        
        # Pre-load your CSV files
        self.context = self.load_all_csv_data()

    def load_all_csv_data(self):
        combined_text = ""
        data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
        
        if not os.path.exists(data_dir):
            return "No data found."

        for file in os.listdir(data_dir):
            if file.endswith(".csv"):
                file_path = os.path.join(data_dir, file)
                # Handle Windows/Excel encoding issues
                for enc in ['utf-8', 'cp1252', 'latin-1']:
                    try:
                        loader = CSVLoader(file_path=file_path, encoding=enc)
                        docs = loader.load()
                        # Take first 15 rows per file
                        content = "\n".join([doc.page_content for doc in docs[:15]])
                        combined_text += f"\n--- DATA FROM {file} ---\n{content}\n"
                        break
                    except:
                        continue
        return combined_text

    def generate_question(self, jd, self_intro, history):
        system_prompt = f"""
        You are a Technical Interviewer.
        CONTEXT: {self.context}
        JD: {jd}
        CANDIDATE: {self_intro}
        
        Rules:
        1. Ask ONE technical question based on the JD or the Candidate's profile.
        2. Reference the CONTEXT for specific technical details.
        3. History: {history}
        """
        
        try:
            response = self.llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content="Next question please.")
            ])
            return response.content
        except Exception as e:
            print(f"❌ Gemini Error: {e}")
            return "⚠️ AI is temporarily unavailable. Please try again in 10 seconds."

    def analyze_score(self, history):
        prompt = f"Analyze this interview and give a score 0-100: {history}"
        return self.llm.invoke([HumanMessage(content=prompt)]).content