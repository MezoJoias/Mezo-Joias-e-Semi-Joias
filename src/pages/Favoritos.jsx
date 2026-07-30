import ProductCard from "../components/ProductCard";
import produtos from "../data/produtos";

function Favoritos() {
  const favoritosSalvos = localStorage.getItem("mezo-favoritos");

  const idsFavoritos = favoritosSalvos
    ? JSON.parse(favoritosSalvos)
    : [];

  const produtosFavoritos = produtos.filter((produto) =>
    idsFavoritos.includes(produto.id)
  );

  const removerFavorito = (id) => {
    const novosFavoritos = idsFavoritos.filter(
      (produtoId) => produtoId !== id
    );

    localStorage.setItem(
      "mezo-favoritos",
      JSON.stringify(novosFavoritos)
    );

    window.location.reload();
  };

  return (
    <main className="favorites-page">
      <p className="section-label">Sua seleção</p>

      <h1>Produtos favoritos</h1>

      {produtosFavoritos.length > 0 ? (
        <div className="products-grid">
          {produtosFavoritos.map((produto) => (
            <ProductCard
              key={produto.id}
              id={produto.id}
              nome={produto.nome}
              preco={produto.preco}
              imagem={produto.imagem}
              descricao={produto.descricao}
              favorito={true}
              aoFavoritar={removerFavorito}
            />
          ))}
        </div>
      ) : (
        <div className="empty-favorites">
          <span>♡</span>

          <h2>Nenhum favorito ainda</h2>

          <p>
            Clique no coração dos produtos que você mais gostou.
          </p>
        </div>
      )}
    </main>
  );
}

export default Favoritos;