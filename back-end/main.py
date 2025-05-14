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

@app.post("/api/image-chat", response_model=ResponseHTTPChat)
async def read_main(in_file: UploadFile = File(...)):
    image_bytes = await in_file.read()
    encoded_image = base64.b64encode(image_bytes).decode("utf-8")
    base64_image = f"data:image/png;base64,{encoded_image}"
    response = {
        "id": genereta_id(),
        "text": run(base64_image)
    }
    return response

@app.post("/api/pdf-chat")
async def read_main(in_file: UploadFile = File(...)):
    try:
        # Leer el contenido del PDF
        pdf_bytes = await in_file.read()

        # Convertir PDF a imágenes
        images = convert_from_bytes(pdf_bytes)

        # Convertir imágenes a base64 para devolverlas en la respuesta
        image_list = []
        for img in images:
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            img.save("test.png")
            encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
            base64_image = f"data:image/png;base64,{encoded_image}"
            image_list.append(base64_image)
        
        analysis = run_pdf(image_list)
        response = {
                "id": genereta_id(),
                "text": analysis
            }
            
        return response

    except Exception as e:
        print(e)
        return  {
                "id": genereta_id(),
                "text": e
            }