import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>💎 Mezo Joias e Semi-Joias</h2>

          <p>
            Joias escolhidas para tornar momentos especiais ainda
            mais inesquecíveis.
          </p>
        </div>

        <div className="footer-column">
          <h3>Navegação</h3>

          <Link to="/">Início</Link>
          <Link to="/#produtos">Produtos</Link>
          <Link to="/favoritos">Favoritos</Link>
        </div>

        <div className="footer-column">
          <h3>Atendimento</h3>

          <a
            href="https://wa.me/5548988148768"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>

          <a
            href="https://www.instagram.com/mezo_joias.semijoias/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>

          <span>Segunda a sábado</span>
        </div>

        <div className="footer-column">
          <h3>Informações</h3>

          <span>Envio para todo o Brasil</span>
          <span>Pagamento seguro</span>
          <span>Atendimento personalizado</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} mezo Joias e Semi-Joias.
          Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;