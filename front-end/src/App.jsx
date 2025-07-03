"use client"
import { useState, useRef } from "react"
import FileInput from "./components/FileInput.jsx"
import FileList from "./components/FileList.jsx"
import Results from "./components/Results.jsx"
import Header from "./components/Header.jsx"
import './Styles.css'
import { requestAttachment } from "./api"

export default function OCRApp() {
  const [files, setFiles] = useState([])
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files || []).filter(file =>
      file.type.startsWith("image/") || file.type === "application/pdf"
    )
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index) => {
    const updated = [...files]
    updated.splice(index, 1)
    setFiles(updated)
  }

  const processDocs = async () => {
    if (files.length === 0) return alert("Sube algún archivo")
    setIsProcessing(true)
    try {
      const res = await Promise.all(files.map(async (file) => {
        const result = await requestAttachment(file)
        return { fileName: file.name, text: result.text }
      }))
      setResults(res)
      setShowResults(true)
    } catch (err) {
      alert("Error: " + err.message)
    }
    setIsProcessing(false)
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Fondo de pantalla */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/Img/Oficina 6.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1
        }}
      />

      {/* Contenido centrado */}
      <div className="ocr-container">
        {showResults ? (
    <Results results={results} goBack={() => setShowResults(false)} />) : (
    <>
      <Header />
      <FileInput onChange={handleFileUpload} triggerRef={fileInputRef} />
      <div className="div-buttoms">
      <button className="ocr-button" onClick={() => fileInputRef.current.click()}>
        Seleccionar archivos
      </button>
      </div>

      <FileList files={files} removeFile={removeFile} />
      <div className="div-buttoms">
      <button
        className="ocr-button"
        onClick={processDocs}
        disabled={isProcessing}
        style={{
          opacity: isProcessing ? "0.7" : "1",
          cursor: isProcessing ? "not-allowed" : "pointer"
        }}
      >
        {isProcessing ? "Procesando..." : "Procesar"}
      </button>
      </div>
    </>
  )}
      </div>
    </div>
  )
}