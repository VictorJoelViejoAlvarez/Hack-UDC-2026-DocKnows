import "../styles/Header.css";
import logo from "/docknows_logo.png";
import viteLogo from "/vite.svg";

function Header() {
  return (
    <header>
      <div id="header-div-1">
        <img id="app-logo" src={logo} alt="Logo" />
        <h1 id="app-name">DocKnows</h1>
      </div>
    </header>
  );
}

export default Header;
