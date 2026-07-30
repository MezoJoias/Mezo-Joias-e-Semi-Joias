import {
  createContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabase";
import produtosIniciais from "../data/produtos";

export const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [produtos, setProdutos] = useState([]);
  const [carregandoProdutos, setCarregandoProdutos] =
    useState(true);

  const buscarProdutos = async () => {
    try {
      setCarregandoProdutos(true);

      const { data, error } = await supabase
  .from("produtos")
  .select("*")
  .order("id", {
    ascending: false,
  });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setProdutos(data);
        return;
      }

      const produtosSalvos =
        localStorage.getItem("mezu-produtos");

      if (produtosSalvos) {
        const produtosAntigos =
          JSON.parse(produtosSalvos);

        if (Array.isArray(produtosAntigos)) {
          setProdutos(produtosAntigos);
          return;
        }
      }

      setProdutos(produtosIniciais);
    } catch (erro) {
      console.error(
        "Erro ao buscar produtos:",
        erro
      );

      const produtosSalvos =
        localStorage.getItem("mezu-produtos");

      if (produtosSalvos) {
        try {
          const produtosAntigos =
            JSON.parse(produtosSalvos);

          setProdutos(
            Array.isArray(produtosAntigos)
              ? produtosAntigos
              : produtosIniciais
          );
        } catch {
          setProdutos(produtosIniciais);
        }
      } else {
        setProdutos(produtosIniciais);
      }
    } finally {
      setCarregandoProdutos(false);
    }
  };

 useEffect(() => {
  buscarProdutos();

  const canalProdutos = supabase
    .channel("produtos-tempo-real")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "produtos",
      },
      (payload) => {
        console.log(
          "Alteração recebida:",
          payload
        );

        buscarProdutos();
      }
    )
    .subscribe((status) => {
      console.log(
        "Status do Realtime:",
        status
      );
    });

  return () => {
    supabase.removeChannel(canalProdutos);
  };
}, []);

  const adicionarProduto = async (
    novoProduto
  ) => {
    const { data, error } = await supabase
      .from("produtos")
      .insert({
        nome: novoProduto.nome,
        preco: novoProduto.preco,
        categoria: novoProduto.categoria,
        descricao:
          novoProduto.descricao || "",
        imagem: novoProduto.imagem,
        imagens: novoProduto.imagens || [],
        variacoes: novoProduto.variacoes || [],
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    setProdutos((produtosAtuais) => [
      data,
      ...produtosAtuais,
    ]);

    return data;
  };

  const editarProduto = async (
    produtoAtualizado
  ) => {
    const { data, error } = await supabase
      .from("produtos")
      .update({
        nome: produtoAtualizado.nome,
        preco: produtoAtualizado.preco,
        categoria:
          produtoAtualizado.categoria,
        descricao:
          produtoAtualizado.descricao || "",
        imagem: produtoAtualizado.imagem,
        imagens:
          produtoAtualizado.imagens || [],
        variacoes:
          produtoAtualizado.variacoes || [],
      })
      .eq("id", produtoAtualizado.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    setProdutos((produtosAtuais) =>
      produtosAtuais.map((produto) =>
        produto.id === data.id
          ? data
          : produto
      )
    );

    return data;
  };

  const excluirProduto = async (id) => {
    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    setProdutos((produtosAtuais) =>
      produtosAtuais.filter(
        (produto) => produto.id !== id
      )
    );
  };

  return (
    <ProductsContext.Provider
      value={{
        produtos,
        carregandoProdutos,
        buscarProdutos,
        adicionarProduto,
        editarProduto,
        excluirProduto,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsProvider;