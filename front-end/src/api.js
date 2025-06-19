import axios from "axios";

// Cliente axios configurado para enviar archivos en formato multipart/form-data
const apiClientMultipart = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
    "Content-Type": "multipart/form-data",
    },
});

/**
 * Envía un archivo al endpoint de análisis OCR del backend.
 * @param {File} attachment - Archivo que será procesado (imagen o PDF)
 * @returns {Promise<Object>} - Respuesta del servidor con el texto extraído
 */
export async function requestAttachment(attachment) {
    const formData = new FormData();
    formData.append("in_file", attachment); // El campo debe coincidir con el parámetro del endpoint

    // Envía la solicitud POST al backend con el archivo adjunto
    const response = await apiClientMultipart.post("/analys-OCR", formData);
    //  Retorna el texto u otros datos procesados
    return response.data

}

