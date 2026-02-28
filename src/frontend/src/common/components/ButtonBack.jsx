import React from "react";
import { useNavigate } from "react-router-dom";

function ButtonBack({ label = "Back", className = "", onClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(-1);
    }
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {label}
    </button>
  );
}

export default ButtonBack;
