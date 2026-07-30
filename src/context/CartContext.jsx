import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [carrinho, setCarrinho] = useState(() => {
    const salvo = localStorage.getItem("mezo-carrinho");

    return salvo ? JSON.parse(salvo) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "mezo-carrinho",
      JSON.stringify(carrinho)
    );
  }, [carrinho]);

  const adicionarAoCarrinho = (id) => {
  setCarrinho((carrinhoAtual) => {
    const existente = carrinhoAtual.find(
      (item) => String(item.id) === String(id)
    );

    if (existente) {
      return carrinhoAtual.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              quantidade: item.quantidade + 1,
            }
          : item
      );
    }

    return [
      ...carrinhoAtual,
      {
        id,
        quantidade: 1,
      },
    ];
  });
};

  const removerDoCarrinho = (id) => {
  setCarrinho((carrinhoAtual) =>
    carrinhoAtual.filter(
      (item) => String(item.id) !== String(id)
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