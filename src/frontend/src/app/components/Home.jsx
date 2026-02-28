import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <main>
      {/* Barra de búsqueda y botón de subir archivo */}
      <div id="body-div-1">
        <input type="text" placeholder="Search..." className="search-input" />
        <button className="upload-file-button" onClick={() => navigate("/upload")}>
          Upload file
        </button>
      </div>
      <div></div>
    </main>
  );
}

export default Home;
