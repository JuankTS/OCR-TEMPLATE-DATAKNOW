import '../Styles.css'
export default function FileList({ files, removeFile }) {
    return (
        <div>
        <h2 className="ocr-header">
            Archivos Seleccionados ({files.length})
        </h2>
        <div className="file-list">
            {files.map((file, index) => (
            <div
                key={index}
                className="file-item"
            >
                <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
                <button className="remove-button" onClick={() => removeFile(index)}>X</button>
            </div>
            ))}
        </div>
        </div>
    )
    }
