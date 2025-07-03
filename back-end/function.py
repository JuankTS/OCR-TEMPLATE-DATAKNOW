import azure.functions as func
from azure.functions import InputStream, HttpRequest, HttpResponse
import json
import base64
from model.model_extration import run, run_pdf
from core.utils import genereta_id
from pdf2image import convert_from_bytes
from io import BytesIO


bp = func.Blueprint()


# -------------------------------------------------------------------
#  HTTP TRIGGER : Lectura de archivos 
# -------------------------------------------------------------------



@bp.function_name(name="http_trigger_OCR_Files")
@bp.route(route="OCR-files", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
async def http_trigger_ocr_files(req: HttpRequest) -> HttpResponse:
    try:
        file = req.files.get('in_file')
        if not file:
                return func.HttpResponse(
                    json.dumps({"id": genereta_id(), "text": "Archivo no recibido"}),
                    status_code=400,
                    mimetype="application/json"
                )
        
        doc_type = file.content_type
        doc= await file.stream.read()

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