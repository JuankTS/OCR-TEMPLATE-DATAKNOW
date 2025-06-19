# OCR-TEMPLATE-DATAKNOW

# Parte Front-End

# 📄 OCRPage – Carga y Procesamiento de Imágenes con OCR

Este componente de React permite a los usuarios **subir archivos de imagen o PDF**, procesarlos mediante OCR (Reconocimiento Óptico de Caracteres) y **visualizar el texto extraído** directamente en la interfaz. Es ideal para proyectos que requieren extraer contenido textual desde documentos escaneados o imágenes.

---

## 🚀 Características

- Subida de múltiples archivos (`.jpg`, `.png`, `.pdf`).
- Filtro automático para aceptar solo archivos válidos.
- Eliminación de archivos antes del procesamiento.
- Llamada a un servicio externo (`requestAttachment`) para procesar OCR.
- Visualización organizada de los resultados.
- Interfaz con estilos personalizados y fondo visual atractivo.

---

## 📦 Dependencias

Este componente usa:
- React `useState`, `useRef`
- Una función externa `requestAttachment(file)` para realizar el OCR (debe estar implementada por el usuario en `./api`)

---

## 📁 Estructura Esperada de `requestAttachment`

```js
// ./api.js
export async function requestAttachment(file) {
  // Devuelve un objeto con el texto procesado
  return {
    text: "Texto extraído del archivo"
  };
}