import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

function chaveVariacoes(variacoes = {}) {
  return JSON.stringify(
    Object.entries(variacoes)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce((resultado, [nome, valor]) => {
        resultado[nome] = valor;
        return resultado;
      }, {})
  );
}

function criarChaveItem(id, variacoes = {}) {
  return `${id}::${chaveVariacoes(variacoes)}`;
}

function CartProvider({ children }) {
  const [carrinho, setCarrinho] = useState(() => {
    try {
      const salvo = localStorage.getItem("mezo-carrinho");
      const itens = salvo ? JSON.parse(salvo) : [];
      return Array.isArray(itens)
        ? itens.map((item) => ({
            ...item,
            variacoesSelecionadas: item.variacoesSelecionadas || {},
            chaveItem:
              item.chaveItem ||
              criarChaveItem(item.id, item.variacoesSelecionadas || {}),
          }))
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("mezo-carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarAoCarrinho = (produtoOuId, variacoesSelecionadas = {}) => {
    const id =
      typeof produtoOuId === "object" ? produtoOuId.id : produtoOuId;
    const variacoes =
      typeof produtoOuId === "object"
        ? produtoOuId.variacoesSelecionadas || variacoesSelecionadas
        : variacoesSelecionadas;
    const chaveItem = criarChaveItem(id, variacoes);

    setCarrinho((carrinhoAtual) => {
      const existente = carrinhoAtual.find(
        (item) => item.chaveItem === chaveItem
      );

      if (existente) {
        return carrinhoAtual.map((item) =>
          item.chaveItem === chaveItem
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [
        ...carrinhoAtual,
        {
          id,
          quantidade: 1,
          variacoesSelecionadas: variacoes,
          chaveItem,
        },
      ];
    });
  };

  const removerDoCarrinho = (chaveOuId) => {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.filter(
        (item) =>
          item.chaveItem !== chaveOuId &&
          String(item.id) !== String(chaveOuId)
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        carrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        setCarrinho,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
