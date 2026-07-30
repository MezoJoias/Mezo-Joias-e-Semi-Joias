import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={fecharMenu}>
        💎 Mezo Joias
      </Link>

      <button
        type="button"
        className="menu-button"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir ou fechar menu"
        aria-expanded={menuAberto}
      >
        {menuAberto ? "✕" : "☰"}
      </button>

      <ul className={menuAberto ? "nav-menu active" : "nav-menu"}>
        <li>
          <Link to="/" onClick={fecharMenu}>
            Início
          </Link>
        </li>

        <li>
          <Link to="/#produtos" onClick={fecharMenu}>
            Produtos
          </Link>
        </li>

        <li>
          <Link to="/favoritos" onClick={fecharMenu}>
            Favoritos
          </Link>
        </li>

      <li>
  <Link to="/carrinho" onClick={fecharMenu}>
    Carrinho
  </Link>
</li>

        <li>
          <a
            href="https://wa.me/5551980486979"
            target="_blank"
            rel="noreferrer"
            onClick={fecharMenu}
          >
            Contato
          </a>
        </li>
  <li>     
  <Link to="/admin" onClick={fecharMenu}>
  Admin
</Link>
</li> 
      </ul>
    </nav>
  );
}

export default Navbar;