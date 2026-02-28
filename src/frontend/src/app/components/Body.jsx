import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import { Upload } from "../../files";
import "../styles/Body.css";

function Body() {
  return (
    <div className="body">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </div>
  );
}

export default Body;
