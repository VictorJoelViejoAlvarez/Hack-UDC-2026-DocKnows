import { useState, useRef } from "react";
import "../styles/Upload.css";
import { ButtonBack } from "../../common";

function Upload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="upload">
      <div>
        <ButtonBack className="upload-button-back"/>
      </div>
      <div
        className={`drop-zone ${dragActive ? "active" : ""}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          className="hidden-input"
        />

        <img src="/image.png" alt="Upload icon" className="upload-image" />
        <span>Drag and drop your file here</span>
      </div>

      {file && (
        <div className="file-info">
          <span>Archivo seleccionado: {file.name}</span>
        </div>
      )}
    </div>
  );
}

export default Upload;
