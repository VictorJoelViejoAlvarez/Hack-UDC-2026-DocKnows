import "../styles/Header.css";
import logo from "/docknows_logo.png";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <div id="header-div-1" onClick={() => navigate("/")}>
        <img id="app-logo" src={logo} alt="Logo" />
        <h1 id="app-name">DocKnows</h1>
      </div>
    </header>
  );
}

export default Header;
