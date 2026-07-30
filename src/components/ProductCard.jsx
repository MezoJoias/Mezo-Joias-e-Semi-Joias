import { useContext } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/CartContext";

function ProductCard({
  id,
  nome,
  preco,
  imagem,
  descricao,
  favorito,
  aoFavoritar,
}) {
  const { adicionarAoCarrinho } =
    useContext(CartContext);

  const adicionarProduto = () => {
    adicionarAoCarrinho(id);

    alert(`${nome} foi adicionado ao carrinho!`);
  };

  return (
    <div className="product-card">
      <button
        type="button"
        className={`favorite-button ${
          favorito ? "active" : ""
        }`}
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

      <p className="product-price">
        {preco}
      </p>

      <div className="product-actions">
        <Link
          to={`/produto/${id}`}
          className="product-link"
        >
          Ver produto
        </Link>

        <button
          type="button"
          className="add-cart-button"
          onClick={adicionarProduto}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}

export default ProductCard;