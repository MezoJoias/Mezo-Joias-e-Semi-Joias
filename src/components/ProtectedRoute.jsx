import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const {
    adminLogado,
    carregandoAuth,
  } = useContext(AuthContext);

  if (carregandoAuth) {
    return (
      <main className="admin-loading">
        <p>Verificando acesso...</p>
      </main>
    );
  }

  if (!adminLogado) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;