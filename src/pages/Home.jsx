import { useState } from "react";

import Banner from "../components/Banner";
import Benefits from "../components/Benefits";
import Categories from "../components/Categories";
import Products from "../components/Products";

function Home() {
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("Todos");

  const selecionarCategoria = (categoria) => {
    setCategoriaSelecionada(categoria);

    setTimeout(() => {
      const secaoProdutos = document.getElementById("produtos");

      secaoProdutos?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <>
      <Banner />
      <Benefits />

      <Categories
        categoriaSelecionada={categoriaSelecionada}
        aoSelecionarCategoria={selecionarCategoria}
      />

      <Products categoriaInicial={categoriaSelecionada} />
    </>
  );
}

export default Home;