import '../Styles.css'


export default function Results({ results, goBack }) {
return (
    <div>
        <h2 className="ocr-header" style={{ fontSize: "30px" }}>Resultados OCR</h2>
        <div className="ocr-box">
            <button className="ocr-button" onClick={goBack}>← Volver</button>
            {results.map((result, index) => (
                <div key={index} className="result-section">
                    <h3 className="result-title">{result.fileName}</h3>
                    <div className="result-content">{result.text}</div>
                </div>
            ))}
        </div>
    </div>
);}
