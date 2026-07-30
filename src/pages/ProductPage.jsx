import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { ProductsContext } from "../context/ProductsContext";

function ProductPage() {
  const { id } = useParams();

  const { produtos } = useContext(ProductsContext);
  const { adicionarAoCarrinho } = useContext(CartContext);

  const produto = produtos.find(
    (item) => String(item.id) === String(id)
  );

  const [imagemSelecionada, setImagemSelecionada] =
    useState("");

  useEffect(() => {
    if (!produto) {
      return;
    }

    const primeiraImagem =
      produto.imagens?.[0] || produto.imagem;

    setImagemSelecionada(primeiraImagem);
  }, [produto]);

  if (!produto) {
    return (
      <main className="product-not-found">
        <h1>Produto não encontrado</h1>

        <p>
          Esse produto não existe ou foi removido.
        </p>

        <Link to="/">
          Voltar para a loja
        </Link>
      </main>
    );
  }

  const imagensDoProduto =
    produto.imagens?.length > 0
      ? produto.imagens
      : [produto.imagem];

  const produtosRelacionados = produtos
    .filter(
      (item) =>
        item.categoria === produto.categoria &&
        item.id !== produto.id
    )
    .slice(0, 3);

  const adicionarProduto = () => {
    adicionarAoCarrinho(produto.id);

    alert(
      `${produto.nome} foi adicionado ao carrinho!`
    );
  };

  const comprarPeloWhatsApp = () => {
    const telefone = "5551980486979";

    const mensagem = `
Olá! Tenho interesse neste produto:

Produto: ${produto.nome}
Código: ${produto.id}
Preço: ${produto.preco}
    `.trim();

    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(
      mensagem
    )}`;

    window.open(link, "_blank");
  };

  return (
    <>
      <main className="product-page">
        <Link
          to="/"
          className="back-link"
        >
          ← Voltar para os produtos
        </Link>

        <div className="product-details">
          <section className="product-gallery">
            <div className="product-main-image">
              <img
                src={imagemSelecionada}
                alt={produto.nome}
              />
            </div>

            {imagensDoProduto.length > 1 && (
              <div className="product-thumbnails">
                {imagensDoProduto.map(
                  (imagem, index) => (
                    <button
                      type="button"
                      key={`${produto.id}-${index}`}
                      className={
                        imagemSelecionada === imagem
                          ? "thumbnail-button active"
                          : "thumbnail-button"
                      }
                      onClick={() =>
                        setImagemSelecionada(imagem)
                      }
                      aria-label={`Ver imagem ${
                        index + 1
                      } de ${produto.nome}`}
                    >
                      <img
                        src={imagem}
                        alt={`${produto.nome} ${
                          index + 1
                        }`}
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </section>

          <section className="product-info">
            <p className="product-category">
              {produto.categoria}
            </p>

            <h1>{produto.nome}</h1>

            <p className="product-code">
              Código do produto: {produto.id}
            </p>

            <p className="product-description">
              {produto.descricao}
            </p>

            <strong className="product-page-price">
              {produto.preco}
            </strong>

            <div className="product-page-actions">
              <button
                type="button"
                className="add-cart-button"
                onClick={adicionarProduto}
              >
                Adicionar ao carrinho
              </button>

              <button
                type="button"
                className="whatsapp-buy-button"
                onClick={comprarPeloWhatsApp}
              >
                Comprar pelo WhatsApp
              </button>
            </div>

            <div className="product-benefits">
              <p>✓ Atendimento personalizado</p>
              <p>✓ Envio para todo o Brasil</p>
              <p>✓ Frete calculado pelo WhatsApp</p>
            </div>
          </section>
        </div>
      </main>

      {produtosRelacionados.length > 0 && (
        <section className="related-products">
          <div className="section-heading">
            <span>Você também pode gostar</span>
            <h2>Produtos relacionados</h2>
          </div>

          <div className="products-grid">
            {produtosRelacionados.map(
              (produtoRelacionado) => (
                <ProductCard
                  key={produtoRelacionado.id}
                  id={produtoRelacionado.id}
                  nome={produtoRelacionado.nome}
                  preco={produtoRelacionado.preco}
                  imagem={produtoRelacionado.imagem}
                  descricao={
                    produtoRelacionado.descricao
                  }
                  favorito={false}
                  aoFavoritar={() => {}}
                />
              )
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default ProductPage;