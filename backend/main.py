import os
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
from pydantic import BaseModel
from Source.sentiment_analysis import analyze_csv, cleanup_temp_storage

app = FastAPI()

# File upload directory
PROJECT_TEMP_DIR = Path(os.getcwd()) / "temp_storage"
PROJECT_TEMP_DIR.mkdir(parents=True, exist_ok=True)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust frontend URL if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a request model
class SentimentAnalysisRequest(BaseModel):
    filename: str


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# File Upload Endpoint
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_location = PROJECT_TEMP_DIR / file.filename
        # with open(file_location, "wb") as f:
        #     shutil.copyfileobj(file.file, f)
        
        return {"filename": file.filename, "message": "File uploaded successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Failed to upload file. Error: {str(e)}"})

@app.post("/sentimentanalysis")
def analyze_uploaded_csv(file: UploadFile = File(...)):
    print("inside analyze sentiments!!!")

    if file.content_type != "text/csv":
        return JSONResponse(content={"error": "Only .csv files are allowed."}, status_code=400)
    
    try:
        # Define the path for storing the uploaded file
        file_path = os.path.join(PROJECT_TEMP_DIR, file.filename)

        # Save the file temporarily
        with open(file_path, "wb") as temp_file:
            shutil.copyfileobj(file.file, temp_file)


        # Perform sentiment analysis
        results=analyze_csv(file_path)
        print("Results:",results)

        return {"results": results}

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Sentiment analysis failed. Error: {str(e)}"})
# @app.post("/sentimentanalysis")
# def analyze_uploaded_csv(request: SentimentAnalysisRequest):
#     print("inside analyze sentiments!!!")
    
#     try:
#         filename = request.filename  # Access the filename from the request body
        
#         # Read the file from the storage location
#         file_location = Path(PROJECT_TEMP_DIR) / filename
#         if not file_location.exists():
#             raise Exception("File not found!")

#         # Perform sentiment analysis
#         results=analyze_csv(file_location)
#         print("Results:",results)

#         return {"results": results}

#     except Exception as e:
#         return JSONResponse(status_code=500, content={"message": f"Sentiment analysis failed. Error: {str(e)}"})
    

@app.on_event("shutdown")
def cleanup_temp_storage():
    # Clean up the temporary directory when the app shuts down
    shutil.rmtree(PROJECT_TEMP_DIR, ignore_errors=True)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
