# OCR-TEMPLATE-DATAKNOW

# Parte Front-End

## 📄 OCRPage – Carga y Procesamiento de Imágenes con OCR

Este componente de React permite a los usuarios **subir archivos de imagen o PDF**, procesarlos mediante OCR (Reconocimiento Óptico de Caracteres) y **visualizar el texto extraído** directamente en la interfaz. Es ideal para proyectos que requieren extraer contenido textual desde documentos escaneados o imágenes.

---

### 🚀 Características

- Subida de múltiples archivos (`.jpg`, `.png`, `.pdf`).
- Filtro automático para aceptar solo archivos válidos.
- Eliminación de archivos antes del procesamiento.
- Llamada a un servicio externo (`requestAttachment`) para procesar OCR.
- Visualización organizada de los resultados.
- Interfaz con estilos personalizados y fondo visual atractivo.

---

### 📦 Dependencias

Este componente usa:
- React `useState`, `useRef`
- Una función externa `requestAttachment(file)` para realizar el OCR (debe estar implementada por el usuario en `./api`)

---

### 📁 Estructura Esperada de `requestAttachment`

```js
// ./api.js
export async function requestAttachment(file) {
  // Devuelve un objeto con el texto procesado
  return {
    text: "Texto extraído del archivo"
  };
}
```
# Parte Back-End

## 🧠 OCR API – Reconocimiento Óptico de Caracteres

Esta API desarrollada con **FastAPI** permite procesar documentos en formato PDF o imágenes para extraer texto mediante técnicas de OCR (Reconocimiento Óptico de Caracteres).

---

### 🚀 Endpoint: `/analys-OCR`

Permite subir un archivo (imagen o PDF) y devuelve el texto extraído del mismo.

- **Método:** `POST`  
- **Content-Type:** `multipart/form-data`

#### 📥 Parámetro de entrada

| Campo      | Tipo         | Descripción                                     |
|------------|--------------|-------------------------------------------------|
| `in_file`  | `UploadFile` | Archivo a analizar (imagen o documento PDF)     |

#### ✅ Tipos de archivos soportados:
- Imágenes (`image/png`, `image/jpeg`, etc.)
- Documentos PDF (`application/pdf`)

#### 🧪 Ejemplo de uso con `curl`

```bash
curl -X POST http://127.0.0.1:8000/analys-OCR \
  -F "in_file=@/ruta/a/mi/archivo.pdf"
```

## 🤖 Módulo de Análisis de Imágenes con Azure OpenAI

Este módulo utiliza la API de Azure OpenAI para analizar imágenes y documentos PDF representados como imágenes (usualmente extraídas de PDFs). Su propósito es extraer información relevante y hacer descripciones a partir del contenido visual, utilizando modelos del tipo GPT-4 con soporte para entrada de imágenes.

---

### 📁 Estructura general del archivo

El script define tres funciones principales:

1. `request_openai()`: Encapsula la lógica para consultar el modelo de Azure OpenAI.
2. `run_pdf()`: Procesa múltiples imágenes provenientes de un PDF y devuelve un análisis por página.
3. `run()`: Procesa una única imagen y devuelve una descripción detallada.

---

### 🔐 Configuración con `.env`

El módulo utiliza variables de entorno para proteger credenciales y configuraciones sensibles:

```env
AZURE_OPENAI_API_KEY=tu_clave_api
AZURE_OPENAI_ENDPOINT=https://tu-endpoint.openai.azure.com/
MODEL_GPT_NAME=nombre_del_despliegue
OPENAI_API_VERSION=2024-02-15-preview
```