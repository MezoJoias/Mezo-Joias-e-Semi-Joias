import {
  useContext,
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

function AdminLogin() {
  const {
    fazerLogin,
    adminLogado,
    carregandoAuth,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] =
    useState(false);

  const enviarLogin = async (evento) => {
    evento.preventDefault();

    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    try {
      setEntrando(true);

      await fazerLogin(email, senha);

      navigate("/admin", {
        replace: true,
      });
    } catch (erroLogin) {
      console.error(erroLogin);

      setErro(
        "E-mail ou senha incorretos."
      );
    } finally {
      setEntrando(false);
    }
  };

  if (carregandoAuth) {
    return (
      <main className="admin-login-page">
        <p>Verificando acesso...</p>
      </main>
    );
  }

  if (adminLogado) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <span>Área restrita</span>

        <h1>Entrar no painel</h1>

        <p>
          Digite o e-mail e a senha do
          administrador.
        </p>

        <form onSubmit={enviarLogin}>
          <label>
            E-mail

            <input
              type="email"
              value={email}
              onChange={(evento) =>
                setEmail(evento.target.value)
              }
              placeholder="seuemail@gmail.com"
              autoComplete="email"
            />
          </label>

          <label>
            Senha

            <input
              type="password"
              value={senha}
              onChange={(evento) =>
                setSenha(evento.target.value)
              }
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </label>

          {erro && (
            <p className="admin-login-error">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={entrando}
          >
            {entrando
              ? "Entrando..."
              : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;