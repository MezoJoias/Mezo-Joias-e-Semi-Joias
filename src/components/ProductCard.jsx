import { useContext } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { ProductsContext } from "../context/ProductsContext";
import {
  converterPreco,
  formatarPreco,
  normalizarVariacoes,
} from "../utils/variacoes";

function ProductCard({
  id,
  nome,
  preco,
  imagem,
  descricao,
  favorito,
  aoFavoritar,
}) {
  const { adicionarAoCarrinho } = useContext(CartContext);
  const { produtos } = useContext(ProductsContext);
  const produtoCompleto = produtos.find(
    (produto) => String(produto.id) === String(id)
  );
  const possuiVariacoes =
    normalizarVariacoes(produtoCompleto?.variacoes).length > 0;

  const adicionarProduto = () => {
    const precoSelecionado = converterPreco(preco);

    adicionarAoCarrinho({
      id,
      variacoesSelecionadas: {},
      precoSelecionado,
      precoFormatado: formatarPreco(precoSelecionado),
    });

    alert(`${nome} foi adicionado ao carrinho!`);
  };

  return (
    <div className="product-card">
      <button
        type="button"
        className={`favorite-button ${favorito ? "active" : ""}`}
        onClick={() => aoFavoritar(id)}
        aria-label={
          favorito
            ? `Remover ${nome} dos favoritos`
            : `Adicionar ${nome} aos favoritos`
        }
      >
        {favorito ? "♥" : "♡"}
      </button>

      <img src={imagem} alt={nome} />
      <h3>{nome}</h3>
      <h4>{descricao}</h4>
      <p className="product-price">{preco}</p>

      <div className="product-actions">
        <Link to={`/produto/${id}`} className="product-link">
          Ver produto
        </Link>

        {possuiVariacoes ? (
          <Link to={`/produto/${id}`} className="add-cart-button">
            Escolher opções
          </Link>
        ) : (
          <button
            type="button"
            className="add-cart-button"
            onClick={adicionarProduto}
          >
            Adicionar ao carrinho
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
