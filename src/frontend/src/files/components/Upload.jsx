import { useState, useRef } from "react";
import "../styles/Upload.css";
import { ButtonBack } from "../../common";

function Upload() {
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const showErrorMessage = () => {
    setErrorMessage(true);
    setErrorVisible(true);

    setTimeout(() => {
      setErrorVisible(false); // activa fade-out
    }, 2500);

    setTimeout(() => {
      setErrorMessage(false); // desmonta después de animación
    }, 3000);
  };

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

  const uploadFile = () => {
    if (!file) {
      showErrorMessage(true);
      return;
    }
  };

  return (
    <div className="upload">
      <div className="div-back-button">
        <ButtonBack className="upload-button-back" />
        <button type="button" onClick={uploadFile}>
          Error demo
        </button>
        <button type="button" className="upload-button" onClick={uploadFile}>
          Upload file
        </button>
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
          <span>Selected file: {file.name}</span>
        </div>
      )}

      {errorMessage && (
        <div className={`upload-error ${errorVisible ? "show" : "hide"}`}>
          <span className="upload-error-message">
            ⚠️ An error occurred in the server during the upload ⚠️
          </span>
        </div>
      )}
    </div>
  );
}

export default Upload;
