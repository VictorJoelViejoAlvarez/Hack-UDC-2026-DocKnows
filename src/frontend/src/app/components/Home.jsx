import "../styles/Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeDocuments } from "../../services/backend";

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [bibliography, setBibliography] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setBibliography([]);

      const data = await analyzeDocuments(query);

      // Ajusta según lo que devuelva tu backend
      setAnswer(data.answer || "No se recibió respuesta.");
      setBibliography(data.bibliography || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Barra de búsqueda y botón de subir archivo */}
      <div id="body-div-1">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button
          className="upload-file-button"
          onClick={() => navigate("/upload")}
        >
          Upload file
        </button>
      </div>
      <div id="body-div-2">
        {/* Texto y Bibliografía */}
        <div id="body-div-2-1">
          <div className="info-card">
            <h3>Answer</h3>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && <p>{answer}</p>}
          </div>

          <div className="info-card">
            <h3>Bibliography</h3>
            {!loading && !error && bibliography.length === 0 && (
              <p>No sources available.</p>
            )}

            {!loading && !error && bibliography.length > 0 && (
              <ul>
                {bibliography.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Preguntas relacionadas */}
        <div id="body-div-2-2"></div>
      </div>
    </main>
  );
}

export default Home;
