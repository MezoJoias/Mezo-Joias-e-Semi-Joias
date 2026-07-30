import {
  createContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregandoAuth, setCarregandoAuth] =
    useState(true);

  useEffect(() => {
    const verificarSessao = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUsuario(session?.user ?? null);
      setCarregandoAuth(false);
    };

    verificarSessao();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_evento, session) => {
        setUsuario(session?.user ?? null);
        setCarregandoAuth(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fazerLogin = async (email, senha) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

    if (error) {
      throw error;
    }

    return data;
  };

  const sair = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  const adminLogado = Boolean(usuario);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        adminLogado,
        carregandoAuth,
        fazerLogin,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}