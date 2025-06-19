from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import base64
from pdf2image import convert_from_bytes
from core.schemas import ResponseHTTPChat
from core.utils import genereta_id
from model.inference import run
from io import BytesIO
from model.inference_pdf import run_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageData(BaseModel):
    image: str

@app.post("/analys-OCR", response_model=ResponseHTTPChat)
async def run_ocr(in_file: UploadFile=File(...)):
    try:
        doc_type = in_file.content_type
        doc= await in_file.read()

        if doc_type in ["application/pdf", "application/x-pdf"]:
            images= convert_from_bytes(doc)
            img_list= []
            for img in images:
                buffered = BytesIO()
                img.save(buffered, format="PNG")
                encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
                base64_image = f"data:image/png;base64,{encoded_image}"
                img_list.append(base64_image)
            
            analysis = run_pdf(img_list)
            response = {
                    "id": genereta_id(),
                    "text": analysis
                }
                
            return response
        elif doc_type.startswith("image/"): 
            encoded_image= base64.b64encode(doc).decode("utf-8")
            base64_image= f"data:{doc_type};base64,{encoded_image}"
            response = {
            "id": genereta_id(),
            "text": run(base64_image)}
            return response
        else:
            return {
                "id": genereta_id(),
                "text": "Tipo de archivo no soportado"
            }
    except Exception as e:
        print(e)
        return  {
                "id": genereta_id(),
                "text": e
            }
