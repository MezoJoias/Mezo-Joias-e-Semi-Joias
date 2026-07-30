import { useContext, useEffect, useState } from "react";

import ProductCard from "./ProductCard";
import { ProductsContext } from "../context/ProductsContext";

function Products({ categoriaInicial = "Todos" }) {
  const [pesquisa, setPesquisa] = useState("");
  const [categoria, setCategoria] =
    useState(categoriaInicial);
  const [ordenacao, setOrdenacao] =
    useState("recentes");

  const [favoritos, setFavoritos] = useState(() => {
    const favoritosSalvos =
      localStorage.getItem("mezo-favoritos");

    return favoritosSalvos
      ? JSON.parse(favoritosSalvos)
      : [];
  });

  useEffect(() => {
    setCategoria(categoriaInicial);
  }, [categoriaInicial]);

  useEffect(() => {
    localStorage.setItem(
      "mezo-favoritos",
      JSON.stringify(favoritos)
    );
  }, [favoritos]);

  const alternarFavorito = (id) => {
    setFavoritos((favoritosAtuais) => {
      const jaFavoritado =
        favoritosAtuais.includes(id);

      if (jaFavoritado) {
        return favoritosAtuais.filter(
          (produtoId) => produtoId !== id
        );
      }

      return [...favoritosAtuais, id];
    });
  };

    const { produtos } = useContext(ProductsContext);

  const converterPreco = (preco) => {
    if (!preco) {
      return 0;
    }

    return Number(
      preco
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim()
    );
  };

  const produtosFiltrados = produtos.filter(
    (produto) => {
      const nomeCombina = produto.nome
        .toLowerCase()
        .includes(pesquisa.toLowerCase());

      const categoriaCombina =
        categoria === "Todos" ||
        produto.categoria === categoria;

      return nomeCombina && categoriaCombina;
    }
  );

  const produtosOrdenados = [
    ...produtosFiltrados,
  ].sort((produtoA, produtoB) => {
    if (ordenacao === "menor-preco") {
      return (
        converterPreco(produtoA.preco) -
        converterPreco(produtoB.preco)
      );
    }

    if (ordenacao === "maior-preco") {
      return (
        converterPreco(produtoB.preco) -
        converterPreco(produtoA.preco)
      );
    }

    if (ordenacao === "nome") {
      return produtoA.nome.localeCompare(
        produtoB.nome
      );
    }

    return produtoB.id - produtoA.id;
  });

  return (
    <section className="products" id="produtos">
      <p className="section-label">
        Nossa coleção
      </p>

      <h2>Produtos em destaque</h2>

      <div className="products-tools">
        <input
          type="text"
          placeholder="Pesquisar joia..."
          value={pesquisa}
          onChange={(event) =>
            setPesquisa(event.target.value)
          }
        />

        <select
          value={categoria}
          onChange={(event) =>
            setCategoria(event.target.value)
          }
        >
          <option value="Todos">
            Todas as categorias
          </option>

          <option value="Colares">
            Colares
          </option>

          <option value="Anéis">
            Anéis
          </option>

          <option value="Brincos">
            Brincos
          </option>

          <option value="Pulseiras">
            Pulseiras
          </option>

          <option value="Tornozeleiras">
            Tornozeleiras
          </option>

          <option value="Kits">
            Kits
          </option>

        </select>
      </div>

      <div className="products-toolbar">
        <p>
          <strong>
            {produtosOrdenados.length}
          </strong>{" "}
          {produtosOrdenados.length === 1
            ? "produto encontrado"
            : "produtos encontrados"}
        </p>

        <label className="sort-select">
          <span>Ordenar por:</span>

          <select
            value={ordenacao}
            onChange={(event) =>
              setOrdenacao(event.target.value)
            }
          >
            <option value="recentes">
              Mais recentes
            </option>

            <option value="menor-preco">
              Menor preço
            </option>

            <option value="maior-preco">
              Maior preço
            </option>

            <option value="nome">
              Nome de A a Z
            </option>
          </select>
        </label>
      </div>

      {produtosOrdenados.length > 0 ? (
        <div className="products-grid">
          {produtosOrdenados.map((produto) => (
            <ProductCard
              key={produto.id}
              id={produto.id}
              nome={produto.nome}
              preco={produto.preco}
              imagem={produto.imagem}
              descricao={produto.descricao}
              favorito={favoritos.includes(
                produto.id
              )}
              aoFavoritar={alternarFavorito}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <span>💎</span>

          <h3>Nenhum produto encontrado</h3>

          <p>
            Tente pesquisar outro nome ou
            selecionar outra categoria.
          </p>

          <button
            type="button"
            onClick={() => {
              setPesquisa("");
              setCategoria("Todos");
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}
    </section>
  );
}

export default Products;