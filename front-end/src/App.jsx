"use client"

import { useState, useRef } from "react"
import { requestAttachment } from "./api";

export default function OCRPage() {
  const [files, setFiles] = useState([])
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  // Manejar la carga de archivos
  const handleFileUpload = (event) => {
  const newFiles = Array.from(event.target.files || [])

  // Filtrar solo imágenes o PDFs
  const acceptedFiles = newFiles.filter(file =>
    file.type.startsWith("image/") || file.type === "application/pdf"
  )

  setFiles(prev => [...prev, ...acceptedFiles])
}

  // Función para activar el input de archivos
  function triggerFileInput() {
    fileInputRef.current.click()
  }

  // Eliminar un archivo
  function removeFile(index) {
    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)
  }

  // Procesar las imágenes
  async function processImages() {
    if (files.length === 0) {
      alert("Por favor, sube al menos un archivo para procesar.")
      return
    }

    setIsProcessing(true)

    // Procesando imagen
    try {
  // Procesa cada archivo y obtiene los resultados reales
      const results = await Promise.all(
        files.map(async (file) => {
          const res = await requestAttachment(file);
          return {
            fileName: file.name,
            text: res.text, 
          };
        })
      );

      setResults(results);
      setShowResults(true);
    } catch (error) {
      alert("Error al procesar imágenes: " + error.message);
    }
    setIsProcessing(false);
  }

  // Volver a la pantalla de carga
  function goBack() {
    setShowResults(false)
  }

  // Estilos para los botones
  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#310380",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
  }

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#A87FF0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
    color: "#310380"
  }

  return (
    <div
    style={{
      position: "fixed",         // Ocupará toda la ventana
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: "url('Img/Oficina 6.jpeg')", // Ruta de la imagen
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      zIndex: -1                 // Para que esté detrás del contenido
    }}>
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", position: "relative", zIndex: 1, }}>
      <h1 style={{ marginBottom: "20px", color: "white", textAlign: "center", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)"}}>Procesamiento OCR de Imágenes</h1>

      {showResults ? (
        // Pantalla de resultados
        <div>
          <button
            onClick={goBack}
            style={{
              ...buttonStyle
            }}
            onMouseOver={(e) => {
              Object.assign(e.target.style, buttonHoverStyle)
            }}
            onMouseOut={(e) => {
              Object.assign(e.target.style, buttonStyle)
            }}
          >
            <span>←</span> Volver
          </button>

          <h2 style={{color:"white", textAlign: "center", fontSize:"35px", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)"}}>Resultados OCR</h2>

          {results.map((result, index) => (
            <div
              key={index}
              style={{
                border: "2px dashed #A87FF0",
                borderRadius: "4px",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "white"
              }}
            >
              <h3 style={{color:"#310380", fontWeight:"bold"}}>{result.fileName}</h3>
              <div
                style={{
                  background: "#A87FF0",
                  padding: "10px",
                  borderRadius: "4px",
                  color:"white"
                }}
              >
                {result.text}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Pantalla de carga de archivos
        <div>
          <div
            style={{
              border: "2px dashed #A87FF0",
              borderRadius: "8px",
              padding: "40px",
              textAlign: "center",
              marginBottom: "20px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h2 style={{ marginBottom: "10px", color:"#A87FF0"}}>Subir archivos para OCR</h2>
            <p style={{ marginBottom: "25px", color: "#A87FF0"}}>Sube imágenes o PDFs para procesarlos usando OCR</p>

            {/* Input de archivo oculto */}
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            {/* Botón personalizado */}
            <button
              onClick={triggerFileInput}
              style={{
                ...buttonStyle,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              onMouseOver={(e) => {
                Object.assign(e.target.style, buttonHoverStyle)
              }}
              onMouseOut={(e) => {
                Object.assign(e.target.style, buttonStyle)
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Seleccionar Archivos
            </button>
          </div>
          {/*Lista de archivos seleccionados*/}
          {files.length > 0 && (
            <div>
              <h2 style={{ marginBottom: "15px", color: "white", textAlign: "center", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)"}}>Archivos Seleccionados ({files.length})</h2>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                
                {files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 15px",
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                      borderBottom: index < files.length - 1 ? "1px solid #eee" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#310380"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginRight: "10px" }}
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span style={{ fontWeight: "bold", color:"#A87FF0"}}>{file.name}</span>
                      <span style={{ marginLeft: "8px", fontSize: "14px", color: "#A87FF0" }}>
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    
                    <button
                      onClick={() => removeFile(index)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: "#310380",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background-color 0.2s",
                        color: "white"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#A87FF0"
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#310380"
                      }}
                    >
                      --
                    </button>
                  </div>
                ))}
              </div>
              {/* Botón de procesar*/}
              <button
                onClick={processImages}
                disabled={isProcessing}
                style={{
                  ...buttonStyle,
                  width: "100%",
                  marginTop: "20px",
                  opacity: isProcessing ? "0.7" : "1",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                }}
                onMouseOver={(e) => {
                  if (!isProcessing) {
                    Object.assign(e.target.style, buttonHoverStyle)
                  }
                }}
                onMouseOut={(e) => {
                  Object.assign(e.target.style, buttonStyle)
                }}
              >
                {isProcessing ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Procesar Archivos"
                )}
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    </div>)
}
